const url = new URL(window.location.href)
const params = url.searchParams
console.log(params.get("localIP"))
console.log("あああああああああああああああああ！！！！！！助けて！！！！！！！！！！！")
const socket = new WebSocket(`ws://${params.get("localIP")}:41129`)


// socket.onclose = function(event) {
//     if (event.wasClean) {
//         console.log('WebSocket connection closed cleanly, code=' + event.code + ' reason=' + event.reason);
//     } else {
//         console.error('WebSocket connection died (B)');
//     }
// };





socket.onerror = (e) => {
    const nowtime = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })
    const prevInManin = document.getElementById("result").innerHTML
    const insertMain =  `<div class="card bg-danger"><div class="card-body"><blockquote class="blockquote mb-0"><p>vcs-server.exeとの通信に失敗しました</p><footer class="blockquote-footer">${nowtime}</footer></blockquote></div><div class="card-footer"><div class="input-group"><button class="btn btn-outline-light btn-sm delhis" type="button" disabled>履歴を消す</button><button class="btn btn-outline-light btn-sm resend" type="button" disabled>再送</button></div></div></div>`
    console.log(e)
    document.getElementById("result").innerHTML = insertMain + prevInManin
}



//
// 受信
//
socket.onmessage = (e) => {
    console.log("受信>>", e.data)
}
//
// 送信 (テキスト)
//
document.getElementById("textform").addEventListener("keypress", (e) => {
    const $textFormValue = document.getElementById("textform").value
    if (e.key === "Enter") {
        if ($textFormValue) {
            document.getElementById("textform").value = ""
            const nowtime = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })
            const prevInManin = document.getElementById("result").innerHTML
            const insertMain =  `<div class="card"><div class="card-body"><blockquote class="blockquote mb-0"><p>${$textFormValue}</p><footer class="blockquote-footer">${nowtime}</footer></blockquote></div><div class="card-footer"><div class="input-group"><button class="btn btn-outline-light btn-sm delhis" type="button">履歴を消す</button><button class="btn btn-outline-light btn-sm resend" type="button">再送</button></div></div></div>`
            document.getElementById("result").innerHTML = insertMain + prevInManin
            console.log("sendToVRChatChatbox>>>  " + $textFormValue)
            socket.send($textFormValue)
            document.getElementById("textform").value = ""
            const bottom = document.getElementById("result").scrollHeight
            window.scrollTo(0,0)
            $$delhisbtns = document.getElementsByClassName("delhis")
        }
    }
    return false
})
//
//履歴を消す
//
const resultaddlistener = new MutationObserver( () => {
    $$delhisbtns = document.getElementsByClassName("delhis")
    for (let i = 0; i < $$delhisbtns.length; i++) {
        $$delhisbtns[i].addEventListener("click" , (e) => {
            e.srcElement.parentNode.parentNode.parentNode.remove()
        })
    }
});
resultaddlistener.observe(document.getElementById("result"), {
    childList: true
})
//
//再送
//
const resultaddlistener2 = new MutationObserver( () => {
    $$resendbtns = document.getElementsByClassName("resend")
    for (let i = 0; i < $$resendbtns.length; i++) {
        $$resendbtns[i].addEventListener("click" , (e) => {
            $textFormValue = e.srcElement.parentNode.parentNode.parentNode.children[0].children[0].children[0].textContent
            const nowtime = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })
            const prevInManin = document.getElementById("result").innerHTML
            const insertMain =  `<div class="card"><div class="card-body"><blockquote class="blockquote mb-0"><p>${$textFormValue}</p><footer class="blockquote-footer">${nowtime}</footer></blockquote></div><div class="card-footer"><div class="input-group"><button class="btn btn-outline-light btn-sm delhis" type="button">履歴を消す</button><button class="btn btn-outline-light btn-sm resend" type="button">再送</button></div></div></div>`
            document.getElementById("result").innerHTML = insertMain + prevInManin
            console.log("sendToVRChatChatbox>>>  " + $textFormValue)
            socket.send($textFormValue)



        })
    }
});
resultaddlistener2.observe(document.getElementById("result"), {
    childList: true
})
//
//クリア
//
document.getElementById("allclearbtn").addEventListener("click", () => {
    $parentsdiv = document.getElementById("result")
    while($parentsdiv.firstChild){
        $parentsdiv.removeChild($parentsdiv.firstChild);
    }
})
//
//定型文
//
document.getElementById("fixedtextbtn").addEventListener("click", () => {
    $flexbtnsvh = document.getElementById("flexbtnsvh")
    if ($flexbtnsvh.classList[0] == "fixedtextdivhidden") {
        $flexbtnsvh.classList.replace("fixedtextdivhidden", "fixedtextview")
    } else {
        $flexbtnsvh.classList.replace("fixedtextview", "fixedtextdivhidden")
    }
})
const $$fixedbtn = document.getElementsByClassName("fixedbtn")
for (let i = 0; i < $$fixedbtn.length; i++) {
    $$fixedbtn[i].addEventListener("click", (e) => {
        $textFormValue = e.srcElement.textContent
        const nowtime = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })
        const prevInManin = document.getElementById("result").innerHTML
        const insertMain =  `<div class="card"><div class="card-body"><blockquote class="blockquote mb-0"><p>${$textFormValue}</p><footer class="blockquote-footer">${nowtime}</footer></blockquote></div><div class="card-footer"><div class="input-group"><button class="btn btn-outline-light btn-sm delhis" type="button">履歴を消す</button><button class="btn btn-outline-light btn-sm resend" type="button">再送</button></div></div></div>`
        document.getElementById("result").innerHTML = insertMain + prevInManin
        console.log("sendToVRChatChatbox>>>  " + e.srcElement.textContent)
        socket.send(e.srcElement.textContent)
    })
}
//
// 送信 (音声)
//
SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
let recognition = new SpeechRecognition();
recognition.lang = 'ja-JP';
recognition.interimResults = true;
recognition.continuous = true;
let finalTranscript = '';
recognition.onresult = (e) => {
    let interimTranscript = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
        let transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
            finalTranscript += transcript;
        } else {
            interimTranscript = transcript;
        }
    }
    document.getElementById("textform").value = finalTranscript + interimTranscript
    if (finalTranscript) {
        socket.send(finalTranscript)
        const $textFormValue = document.getElementById("textform").value
        const nowtime = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })
        const prevInManin = document.getElementById("result").innerHTML
        const insertMain =  `<div class="card"><div class="card-body"><blockquote class="blockquote mb-0"><p>${$textFormValue}</p><footer class="blockquote-footer">${nowtime}</footer></blockquote></div><div class="card-footer"><div class="input-group"><button class="btn btn-outline-light btn-sm delhis" type="button">履歴を消す</button><button class="btn btn-outline-light btn-sm resend" type="button">再送</button></div></div></div>`
        document.getElementById("result").innerHTML = insertMain + prevInManin
        console.log("sendToVRChatChatbox>>>  " + $textFormValue)
        socket.send($textFormValue)
        document.getElementById("textform").value = ""
        const bottom = document.getElementById("result").scrollHeight
        window.scrollTo(0,0)
        $$delhisbtns = document.getElementsByClassName("delhis")
        finalTranscript = ""
    }

}
window.addEventListener("DOMContentLoaded", () => {
    const $checkboxSingle = document.getElementById("micbtn");
    $checkboxSingle.addEventListener("change",function(){
        if (this.checked) {
            document.getElementById("micbtnlabel").innerText = "音声認識中…"
            recognition.start();
        } else {
            recognition.stop();
            document.getElementById("micbtnlabel").innerText = "音声入力"
            document.getElementById("textform").value = ""
        }
    });
});
