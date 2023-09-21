import datetime, argparse, socket, sys, time, webbrowser

from websocket_server import WebsocketServer
from pythonosc import udp_client




# OSC周りの宣言
parser = argparse.ArgumentParser()
parser.add_argument("--ip", default=socket.gethostbyname(socket.gethostname()))
parser.add_argument("--port", type=int, default=9000)
args = parser.parse_args()
client = udp_client.SimpleUDPClient(args.ip, args.port)



runningCrientNum = 0
# 接続
def new_client(client, server):
    global runningCrientNum
    runningCrientNum += 1
    id, address = client["id"], client["address"]
    print(f"┃ JOIN>>  ID:{id} IP:{address}")


# 切断
def client_left(client, server):
    global runningCrientNum
    runningCrientNum -= 1
    id, address = client["id"], client["address"]
    print(f"┃ QUIT>>  ID:{id} IP:{address}")
    if runningCrientNum == 0:
        time.sleep(2)
        if runningCrientNum == 0:
            server.shutdown()
            sys.exit(0)


# 受信
def message_received(client_, server, message):
    nowtime = datetime.datetime.now().time().replace(microsecond=0)
    id = client_["id"]
    print(f"┃ MESSAGE_{id}_{nowtime}>>  {message}  ")
    SENDTEXT = (message, True)
    client.send_message("/chatbox/input", SENDTEXT)




server = WebsocketServer(port=41129, host=socket.gethostbyname(socket.gethostname()))

server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)


webbrowser.open(f"http://wi11oh.com/dev/vcs/vrc_chatbox_sender?localIP={socket.gethostbyname(socket.gethostname())}", new=1, autoraise=True)




print("┏>>>>>>>>>server has started!")
print(f"┃>>>>>>>>>legal_notice_URL :  https://github.com/wi11oh/vrc_chatbox_sender_frombrowser/blob/main/ThirdPartyNotices.md")
print(f"┃>>>>>>>>>┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓")
print(f"┃>>>>>>>>>┃   controller_URL : https://wi11oh.com/dev/vcs/vrc_chatbox_sender?localIP={socket.gethostbyname(socket.gethostname())}    ┃")
print(f"┃>>>>>>>>>┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛")
server.run_forever()
print("┗>>>>>>>>>server has stopped!  created by @UirouMachineVRC(https://twitter.com/UirouMachineVRC)")
