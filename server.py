from websocket_server import WebsocketServer
from datetime import datetime
import argparse
from pythonosc import udp_client




# OSC周りの宣言
parser = argparse.ArgumentParser()
parser.add_argument("--ip", default="192.168.0.10")
parser.add_argument("--port", type=int, default=9000)
args = parser.parse_args()
client = udp_client.SimpleUDPClient(args.ip, args.port)




# 接続
def new_client(client, server):
    id, address = client["id"], client["address"]
    print(f"┃ JOIN>>  ID:{id} IP:{address}")


# 切断
def client_left(client, server):
    id, address = client["id"], client["address"]
    print(f"┃ QUIT>>  ID:{id} IP:{address}")


# 受信
def message_received(client_, server, message):
    nowtime = datetime.now().time().replace(microsecond=0)
    id = client_["id"]
    print(f"┃ MESSAGE_{id}_{nowtime}>>  {message}  ")
    SENDTEXT = (message, True)
    client.send_message("/chatbox/input", SENDTEXT)




server = WebsocketServer(port=41129, host='192.168.0.10')

server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)
print("┏>>>>>>>>>server has started!")
server.run_forever()
print("┗>>>>>>>>>server has stopped!  created by @UirouMachineVRC(https://twitter.com/UirouMachineVRC)")