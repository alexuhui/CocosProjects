if "%1"=="" (
    set gameName=newGame
) else (
    set gameName=%1
)
if "%2"=="" (
    set company=my_company
) else (
    set company=%2
)

cocos new %gameName% -p com.%company%.%gameName% -l cpp -d ./