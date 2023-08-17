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
  const [cameraStreamUrl, setCameraStreamUrl] = useState<string | null>();
  const [qrCodeData, setQrCodeData ] = useState<any| null>(null);
  const videoEl = useRef<HTMLVideoElement>(null);

  const initCamera = async()=>{
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: {
          ideal: 'environmnet'
        }
      },
    });
    setCameraStream(stream);
    if(videoEl.current){
      console.log('srcobject set');
      videoEl.current.srcObject = stream;
      videoEl.current.onloadedmetadata = () =>{
        videoEl.current!.play()
      }
      const data: any = await QrCodeDecoder.decodeFromVideo(videoEl.current);
      console.log('readed data:', data);
      setQrCodeData(data.data);
    }
  }  

  useEffect(
    () =>{
      initCamera();
    },
    []
  );
  
  if(!cameraStream){
    return(
      <div>
        <p>Você precisa fornecer permissão de acesso à câmera para poder scanear o QRCode.</p>
        <button onClick={initCamera}>Solicitar permissoes</button>
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
