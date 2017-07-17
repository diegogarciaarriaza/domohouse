#!/bin/sh

osascript -e 'tell application "iTerm" to activate' 

osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "t" using command down'
osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "sudo mongod"'
osascript -e 'tell application "System Events" to tell process "iTerm" to key code 52'
osascript -e 'tell application "System Events" to tell process "iTerm" to delay 1'
osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "gilipolli"'
osascript -e 'tell application "System Events" to tell process "iTerm" to key code 52'

osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "d" using command down' 
osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "cd /Applications/MAMP/htdocs/PFC_Microservicios/auth_microservice/"' 
osascript -e 'tell application "System Events" to tell process "iTerm" to key code 52'
osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "nodemon"'
osascript -e 'tell application "System Events" to tell process "iTerm" to key code 52'

osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "D" using command down'
osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "cd /Applications/MAMP/htdocs/PFC_Microservicios/users_microservice/"'
osascript -e 'tell application "System Events" to tell process "iTerm" to key code 52'
osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "nodemon"'
osascript -e 'tell application "System Events" to tell process "iTerm" to key code 52'

osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "t" using command down'
osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "cd /Applications/MAMP/htdocs/Pruebas_socket.io/frontend/"'
osascript -e 'tell application "System Events" to tell process "iTerm" to key code 52'
osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "npm start"'
osascript -e 'tell application "System Events" to tell process "iTerm" to key code 52'

osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "d" using command down'
osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "cd /Applications/MAMP/htdocs/PFC_Microservicios/components_microservice/"'
osascript -e 'tell application "System Events" to tell process "iTerm" to key code 52'
osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "nodemon"'
osascript -e 'tell application "System Events" to tell process "iTerm" to key code 52'

osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "d" using command down'
osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "cd /Applications/MAMP/htdocs/PFC_Microservicios/events_microservice/"'
osascript -e 'tell application "System Events" to tell process "iTerm" to key code 52'
osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "nodemon"'
osascript -e 'tell application "System Events" to tell process "iTerm" to key code 52'

osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "]" using {option down, command down}'
osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "D" using command down'
osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "cd /Applications/MAMP/htdocs/PFC_Microservicios/crontask_microservice/"'
osascript -e 'tell application "System Events" to tell process "iTerm" to key code 52'
osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "nodemon"'
osascript -e 'tell application "System Events" to tell process "iTerm" to key code 52'

osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "]" using {option down, command down}'
osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "D" using command down'
osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "cd /Applications/MAMP/htdocs/PFC_Microservicios/requests_microservice/"'
osascript -e 'tell application "System Events" to tell process "iTerm" to key code 52'
osascript -e 'tell application "System Events" to tell process "iTerm" to keystroke "nodemon"'
osascript -e 'tell application "System Events" to tell process "iTerm" to key code 52'
