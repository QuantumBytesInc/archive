from channels.routing import route
from project.communication import consumers as consumers_chat
from project.item import consumers as consumers_storage

channel_routing = [
    # This makes Django serve static files from settings.STATIC_URL, similar
    # to django.views.static.serve. This isn't ideal (not exactly production
    # quality) but it works for a minimal example.

    # Wire up websocket channels to our consumers:
    route('websocket.connect', consumers_chat.ws_connect, path=r"^/ws/[0-f]{32}"),
    route('websocket.receive', consumers_chat.ws_receive, path=r"^/ws/[0-f]{32}"),
    route('websocket.disconnect', consumers_chat.ws_disconnect, path=r"^/ws/[0-f]{32}"),

    route('websocket.connect', consumers_storage.ws_connect, path=r"^/ws/storage/[0-f]{32}"),
    route('websocket.receive', consumers_storage.ws_receive, path=r"^/ws/storage/[0-f]{32}"),
    route('websocket.disconnect', consumers_storage.ws_disconnect, path=r"^/ws/storage/[0-f]{32}"),
]
