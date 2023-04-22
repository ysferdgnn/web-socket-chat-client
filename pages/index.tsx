import type {NextPage}
from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useState,useEffect} from 'react'
import { CompatClient, Stomp} from '@stomp/stompjs'
import { Button,Card,CardBody,CardHeader,Input } from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import MessageModel from '../model/messageModel'
import SockJS from 'sockjs-client';
const SOCKET_URL = 'http://localhost:8080/chat';
import { StompHandler } from './api/service/stomp-handler'



const Home: NextPage = () => {

    const [username, setUsername] = useState<String>('')
    const [messages, setMessages] = useState<MessageModel[]>([])
    const [sendMessage, setSendMessage] = useState<String>('')
  
    const [stompClient,setStompClient] = useState<CompatClient|undefined >()
    const [isConnected,setIsConnected] = useState(false)
  
    const stompHandler = new StompHandler();
    const onMessageCallback=(message:MessageModel)=>{
      console.log('çalışıyom');
     
    
      setMessages((prevMessages:any[]) =>([...prevMessages,message]));
    }

  
    useEffect(() => {
      import ("bootstrap/dist/js/bootstrap");
  }, [])



   



const connect =()=>{
  
  
  let stompClientRef= stompHandler.connect(SOCKET_URL,onMessageCallback)
    setStompClient(stompClientRef);
    setIsConnected(true);
}

const disconnect = ()=>{
  if(stompClient){

 
    stompHandler.disconnect(stompClient);
    setIsConnected(false)
  }
}

const sendMessageWs =()=>{
  if(stompClient){
    stompHandler.sendMessageToWs(username,sendMessage,stompClient);
  }
  
}





const onChangeUsername = (username : String)=>{
  console.log("username:"+username)
  setUsername(username);
}

const onChangeMessage=(message:String)=>{
  setSendMessage(message)
}



 
   
 return (
  <>
      <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </Head>
      <div className={
          styles.mainbox
      }>

          <Input placeholder='Username'
              onChange={e => onChangeUsername(e.target.value)}
              className={
                  styles.usernameInput
          }></Input>
          <Button color='primary'
              onClick={connect} disabled={isConnected}>Connect</Button>
              <Button color='danger' disabled={!isConnected}
              onClick={disconnect}>Close Connection</Button>

          <Input onChange={e => onChangeMessage(e.target.value)}></Input>
          <Button onClick={sendMessageWs} disabled={!isConnected}
              color='success'>Send Message</Button>
          <br></br>
          </div>
          {
          messages.map((message, i) => {
              return (
                  <Card key={i}>
                    <CardHeader>
                      {message.sender}
                    </CardHeader>
                    <CardBody>
                      {message.message}
                    </CardBody>
                     
                      <hr></hr>
                  </Card>
              )
          })
      } 

  </>

)
}

export default Home
