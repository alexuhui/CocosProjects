local MainScene = class("MainScene", cc.load("mvc").ViewBase)

function MainScene:onCreate()
    -- ���� MainScene.csb
    
    local root = cc.CSLoader:createNode("MainScene.csb")
    self:addChild(root)
    -- ��ȡ play��ť
    local btn = root:getChildByName("play")
    -- ����¼�����
    btn:addTouchEventListener(function (sender,evt)
        if evt == 2 then
            self:getApp():enterScene("PlayScene")
        end
    end)
end

return MainScene
