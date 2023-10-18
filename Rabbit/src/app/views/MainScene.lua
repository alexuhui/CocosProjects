local MainScene = class("MainScene", cc.load("mvc").ViewBase)

function MainScene:onCreate()
    -- 加载 MainScene.csb
    
    local root = cc.CSLoader:createNode("MainScene.csb")
    self:addChild(root)
    -- 获取 play按钮
    local btn = root:getChildByName("play")
    -- 添加事件处理
    btn:addTouchEventListener(function (sender,evt)
        if evt == 2 then
            self:getApp():enterScene("PlayScene")
        end
    end)
end

return MainScene
