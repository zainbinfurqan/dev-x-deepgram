export const audioGet = {
    getMediaAudio: async () => {
        let audioNote = ''
        let mediaRecorder = null;
        let socket = null
        await window.navigator.mediaDevices.getUserMedia({ audio: true }).then((res) => {
            mediaRecorder = new MediaRecorder(res, {
                audio: true,
            });
        })
        socket = new WebSocket("wss://api.deepgram.com/v1/listen", [
            "token",
            "0f23ae2ad1b21bcd93fd898f68bf3fb4d318e32a",
        ]);
        const socketOnOpen = async () => {
            console.log('onopen')
            socket.onopen = () => {
                mediaRecorder.addEventListener("dataavailable", async (event) => {
                    if (event.data.size > 0 && socket.readyState == 1) {
                        socket.send(event.data);
                        // console.log(event.data)
                    }
                });
                mediaRecorder.start();
            };
        }
        const socketOnMessage = async () => {
            socket.onmessage = (message) => {
                console.log('onmessage')
                const received = JSON.parse(message.data);
                const transcript = received.channel.alternatives[0].transcript;
                if (transcript && received.is_final) {
                    console.log("transcript=>", transcript);
                    audioNote = transcript
                    mediaRecorder.stop();
                    // document.querySelector("#captions").textContent += transcript + " ";
                }
            };
        }
        socket.onclose = () => {
            console.log({ event: "onclose" });
        };
        socket.onerror = (error) => {
            console.log({ event: "onerror", error });
        };
        console.log("mediaRecorder", mediaRecorder)
        return { audioNote, mediaRecorder, socket, socketOnOpen, socketOnMessage }
    }
}