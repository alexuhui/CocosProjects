local PlayScene = class("PlayScene", cc.load("mvc").ViewBase)

local GameLogital = import("..models.GameLogital")

function PlayScene:onCreate()
    --����������
    self.root = cc.CSLoader:createNode("PlayScene.csb"):addTo(self)
    --���ؽ��涯��
    local act = cc.CSLoader:createTimeline("PlayScene.csb")
    self.root:runAction(act)
    --������Ϸ�߼���
    self.logi = GameLogital:create()
    --��ʼ������
    self:initStoneListeners()--��ʼ��ʯͷ�ļ�������
    self:initSettlementInterface()--��ʼ���������
    self:updateStoneBoard()--����ʯͷ״̬
end
function PlayScene:initStoneListeners()
    --˫��forѭ������
    for i = 1,9 do
        for j = 1,9 do
            local sp = self:getStonePic(i,j)--��ȡi,j���λ���ϵ�ʯͷ�ؼ�
            --�����ڲ��ɼ�������²��ܵõ������¼�������������޸�͸���ȵķ�ʽ�����ؿؼ���
            sp:setVisible(true)
            sp:setOpacity(0)
            sp:setTouchEnabled(true)
            sp:addTouchEventListener(
                function(sender,evt)--ʹ�ñհ���ʡȥ��ȡij��self����
                    if self:checkWin() then
                        return 
                    end
                    if evt == 2 and self.logi:touchStone(i,j) then
                        --�����ǰ�����¼���������ݸ��£���ô���½���
                        self:updateStoneBoard()
                        self:updateRabbitPosition()
                        --�����Ϸ�Ƿ����
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
    
    local act = self.root:getActionByTag(self.root:getTag())--���Ŷ���
    act:gotoFrameAndPlay(0,false)
    --��ȡǶ�׽ڵ������������
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
