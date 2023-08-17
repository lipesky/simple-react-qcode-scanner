import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import QrcodeDecoder from 'qrcode-decoder/dist/index';

const useQrCodeDecoder = () =>{
  return new QrcodeDecoder();
}

function App() {

  const QrCodeDecoder = useQrCodeDecoder();
  const [cameraStream, setCameraStream] = useState<MediaStream | null>();
  const [qrCodeData, setQrCodeData ] = useState<any| null>(null);
  const videoEl = useRef<HTMLVideoElement>(null);

  const startCameraStreaming = async() =>{
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: {
          ideal: 'environment'
        }
      },
    });
    setCameraStream(stream)
  }

  const attachStreamToVideoEl = async()=>{
    videoEl.current!.srcObject = cameraStream!;
    videoEl.current!.onloadedmetadata = () =>{
      videoEl.current!.play()
    }
    const data: any = await QrCodeDecoder.decodeFromVideo(videoEl.current!);
    console.log('readed data:', data);
    setQrCodeData(data.data);
  } 



  useEffect(
    () =>{
      startCameraStreaming();
    },
    []
  );

  useEffect(
    () =>{
      if(cameraStream && videoEl.current){
        attachStreamToVideoEl();
      }
    },
    [cameraStream, videoEl.current]
  );
  
  if(!cameraStream){
    return(
      <div>
        <p>Você precisa fornecer permissão de acesso à câmera para poder scanear o QRCode.</p>
        <button onClick={startCameraStreaming}>Solicitar permissoes</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Aponte a câmera para o QrCode</h1>
      <video ref={videoEl}></video>
      <p>QrCode: {qrCodeData ?? 'Nenhum QrCode lido'}</p> 
    </div>
  );
}

export default App;
