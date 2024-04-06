# bots_dashboard

A standalone application for monitoring the behavior of [zwoo](https://github.com/fabiankachlock/zwoo) bots.

## Architecture

This app consists of two major parts:

1. `zrp-proxy` A simple websocket proxy server speaking a extend version of the [ZRP](#TODO), able to redirect zrp messages from a running zwoo game server to the dashboard.
2. ``