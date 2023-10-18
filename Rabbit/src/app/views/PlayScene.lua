local PlayScene = class("PlayScene", cc.load("mvc").ViewBase)

local GameLogital = import("..models.GameLogital")

function PlayScene:onCreate()
    --加载主界面
    self.root = cc.CSLoader:createNode("PlayScene.csb"):addTo(self)
    --加载界面动画
    local act = cc.CSLoader:createTimeline("PlayScene.csb")
    self.root:runAction(act)
    --创建游戏逻辑类
    self.logi = GameLogital:create()
    --初始化界面
    self:initStoneListeners()--初始化石头的监听函数
    self:initSettlementInterface()--初始化结算界面
    self:updateStoneBoard()--更新石头状态
end
function PlayScene:initStoneListeners()
    --双重for循环遍历
    for i = 1,9 do
        for j = 1,9 do
            local sp = self:getStonePic(i,j)--获取i,j这个位置上的石头控件
            --对象在不可见的情况下不能得到触摸事件，因而这里用修改透明度的方式来隐藏控件。
            sp:setVisible(true)
            sp:setOpacity(0)
            sp:setTouchEnabled(true)
            sp:addTouchEventListener(
                function(sender,evt)--使用闭包，省去获取ij及self对象
                    if self:checkWin() then
                        return 
                    end
                    if evt == 2 and self.logi:touchStone(i,j) then
                        --如果当前触摸事件有造成数据更新，那么更新界面
                        self:updateStoneBoard()
                        self:updateRabbitPosition()
                        --检查游戏是否结束
                        if self:checkWin() then
                            self:showSettlementInterface()
                        end
                    end
                end)
        end
    end
end

function PlayScene:initSettlementInterface()
    -- do nothing
end

function PlayScene:updateStoneBoard()
    for i = 1,9 do
        for j = 1,9 do
            self:showStone(i,j,self.logi:isStoneHided(i,j))
        end
    end
end

function PlayScene:showSettlementInterface()
    local logi = self.logi
    local text = "YOU LOSE" 
    local color = cc.c3b(128,128,128)
    if logi:isWin() then
        text = string.format("YOU WIN",logi:stepCount())
        color = cc.c3b(255,215,0)
    end
    local step = logi:stepCount()
    
    local act = self.root:getActionByTag(self.root:getTag())--播放动画
    act:gotoFrameAndPlay(0,false)
    --获取嵌套节点设置相关属性
    local settlementLayer = self.root:getChildByName("settlement")
    for k,v in pairs(settlementLayer:getChildren())do
        print(k,v:getName())
    end
    local winLabel = settlementLayer:getChildByName("tip")--Text
    winLabel:setString(text)
    local stepLabel = settlementLayer:getChildByName("step")--FNT
    stepLabel:setString(string.format("%d step",step))

    self:runAction(cc.Sequence:create(cc.DelayTime:create(2),cc.CallFunc:create(
        function ()self:getApp():enterScene("MainScene")end)))
end

function PlayScene:checkWin()
    local logi = self.logi
    if not logi:isLose() and not logi:isWin() then
        return false
    end
    return true
end

function PlayScene:updateRabbitPosition()
    local pos = self.logi:getRabbitPos()
    local coord = cc.p(self:getStonePic(pos.x,pos.y):getPosition())
    self:getRabbitPic():setPosition(coord)
end

function PlayScene:showStone(x,y,state)
    if not state then
        local obj = self:getStonePic(x,y)
        obj:setOpacity(255)
    else
        self:getStonePic(x,y)
            :setOpacity(0)
    end
end

function PlayScene:getStonePic(x,y)
    return self.root:getChildByName(string.format("%d_%d",y,x))
end
function PlayScene:getRabbitPic()
    return self.root:getChildByName("rabbit")
end
return PlayScene
