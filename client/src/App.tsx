import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

import './App.css';

const socket = io('http://localhost:5000/webRTCPeers', { path: '/webrtc' });

function App() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pc = useRef<RTCPeerConnection>();
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [offerVisible, setOfferVisible] = useState(true);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [status, setStatus] = useState('Make a call');

  const getUserMedia = async () => {
    const _pc = new RTCPeerConnection();

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    if (stream && localVideoRef?.current) {
      localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach((track) => {
        _pc.addTrack(track, stream);
      });
    }
    _pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log('ice candidate', JSON.stringify(e.candidate));
        socket.emit('candidate', e.candidate);
      }
    };

    _pc.onconnectionstatechange = (e) => {
      console.log('connection state change', e);
    };

    _pc.ontrack = (e) => {
      console.log('on track', e);
      if (e.streams && e.streams[0] && remoteVideoRef?.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
      }
    };
    pc.current = _pc;
  };

  const sendToPeer = (messageType: string, payload: any) => {
    socket.emit(messageType, {
      socketID: socket.id,
      payload,
    });
  };

  const proccessSDP = async (sdp: RTCSessionDescriptionInit) => {
    if (!pc.current) return;

    await pc.current.setLocalDescription(sdp);
    console.log(JSON.stringify(sdp));
    sendToPeer('sdp', { sdp });
  };

  const createOffer = async () => {
    if (pc.current) {
      const offer = await pc.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await proccessSDP(offer);
      setOfferVisible(false);
      setStatus('Calling...');
    }
  };

  const createAnswer = async () => {
    if (pc.current) {
      const answer = await pc.current.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await proccessSDP(answer);
      setAnswerVisible(false);
      setStatus('Call established');
    }
  };

  useEffect(() => {
    socket.on('connection-success', (success) => {
      console.log(success);
    });
    socket.on('sdp', (data) => {
      console.log('sdp', data);
      pc.current?.setRemoteDescription(new RTCSessionDescription(data.payload.sdp));
      if (textRef.current) {
        textRef.current.value = JSON.stringify(data.payload.sdp);
      }
      if (data.payload.sdp.type === 'offer') {
        setOfferVisible(false);
        setAnswerVisible(true);
        setStatus('Incoming call...');
      } else {
        setStatus('Call established');
      }
    });
    socket.on('candidate', (candidate) => {
      console.log('candidates', candidate);
      // candidates.current = [...candidates.current, candidate];
      pc.current?.addIceCandidate(new RTCIceCandidate(candidate));
    });
    getUserMedia();
  }, []);

  const showHideButtons = () => {
    if (offerVisible) {
      return (
        <div>
          <button
            onClick={() => {
              createOffer();
            }}
          >
            call
          </button>
        </div>
      );
    }

    if (answerVisible) {
      return (
        <div>
          <button
            onClick={() => {
              createAnswer();
            }}
          >
            answer
          </button>
        </div>
      );
    }
  };

  return (
    <>
      <div style={{ margin: 10 }}>
        <video
          ref={localVideoRef}
          autoPlay
          style={{ height: 240, margin: 5, backgroundColor: 'black', aspectRatio: 4 / 3 }}
        ></video>
        <video
          ref={remoteVideoRef}
          autoPlay
          style={{ height: 240, margin: 5, backgroundColor: 'black', aspectRatio: 4 / 3 }}
        ></video>
      </div>
      {showHideButtons()}
      {status}

      <br />
      <textarea ref={textRef}></textarea>
      <br />
    </>
  );
}

export default App;
