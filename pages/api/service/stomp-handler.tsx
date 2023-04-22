import {CompatClient, IMessage, Stomp, messageCallbackType} from "@stomp/stompjs"
import MessageModel from "../../../model/messageModel";
import SockJS from "sockjs-client";

export class StompHandler {
    StompHandler() {}

    onMessageCallbackFunc : ((message: MessageModel) => void) | undefined
    stompClient :CompatClient | undefined

    connect(SOCKET_URL : string,onMessageCallback: (message:MessageModel) => void) : CompatClient  {
        console.log("connecting socket server..");
        this.onMessageCallbackFunc = onMessageCallback
        var client = new SockJS(SOCKET_URL);
        var clientStompOver = Stomp.over(client);
        clientStompOver.connect({}, this.onConnected, this.onError)
        this.stompClient=clientStompOver;
        return this.stompClient
        
    }

    sendMessageToWs(username : String, messageBody : String, stompClient : CompatClient) {
        let messageModel: MessageModel = {
            sender: username,
            message: messageBody
        }

        stompClient.send('/chat', {}, JSON.stringify(messageModel));


    }

     disconnect(stompClient : CompatClient){
        stompClient.disconnect();
         
       }
    
    private onError=(error : any) => {
        console.log(error)
    }

    private onConnected=( username : String)=> {
        console.log('on connected working');
        if (this.stompClient) {
           
           
            this.stompClient.subscribe("/topic", this.onMessage)
            console.log("Connected!!")
            this.stompClient.send('/chat', {}, JSON.stringify({
                sender: username,
                message: username + ' connected!'
            }))
        }

    }

  

    onMessage=(payload : IMessage) =>{
        if(!this.onMessageCallbackFunc){
            throw new Error('onMessageCallbackFunc is undefined!');
        }
        console.log("message received!")
        var message = JSON.parse(payload.body)
        console.log(message);
        this.onMessageCallbackFunc(message);

    }

}
