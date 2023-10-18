/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#include "HelloWorldScene.h"
#include "SimpleAudioEngine.h"
#include "base/CCEventCustom.h"

#include <sstream>
#include <iomanip> // 用于设置精度

USING_NS_CC;


const char* HelloWorld::EVENT_TEST = "event_test";
const char* HelloWorld::EVENT_TEST2 = "event_test2";

Scene* HelloWorld::createScene()
{
    return HelloWorld::create();
}

// Print useful error message instead of segfaulting when files are not there.
static void problemLoading(const char* filename)
{
    printf("Error while loading: %s\n", filename);
    printf("Depending on how you compiled you might have to add 'Resources/' in front of filenames in HelloWorldScene.cpp\n");
}

// on "init" you need to initialize your instance
bool HelloWorld::init()
{
    //////////////////////////////
    // 1. super init first
    if ( !Scene::init() )
    {
        return false;
    }

    auto visibleSize = Director::getInstance()->getVisibleSize();
    Vec2 origin = Director::getInstance()->getVisibleOrigin();

    /////////////////////////////
    // 2. add a menu item with "X" image, which is clicked to quit the program
    //    you may modify it.

    // add a "close" icon to exit the progress. it's an autorelease object
    auto closeItem = MenuItemImage::create(
                                           "CloseNormal.png",
                                           "CloseSelected.png",
                                           CC_CALLBACK_1(HelloWorld::menuCloseCallback, this));

    if (closeItem == nullptr ||
        closeItem->getContentSize().width <= 0 ||
        closeItem->getContentSize().height <= 0)
    {
        problemLoading("'CloseNormal.png' and 'CloseSelected.png'");
    }
    else
    {
        float x = origin.x + visibleSize.width - closeItem->getContentSize().width/2;
        float y = origin.y + closeItem->getContentSize().height/2;
        closeItem->setPosition(Vec2(x,y));
    }

    // create menu, it's an autorelease object
    auto menu = Menu::create(closeItem, NULL);
    menu->setPosition(Vec2::ZERO);
    this->addChild(menu, 1);

    /////////////////////////////
    // 3. add your codes below...

    // add a label shows "Hello World"
    // create and initialize a label

    auto label = Label::createWithTTF("Hello World", "fonts/Marker Felt.ttf", 24);
    if (label == nullptr)
    {
        problemLoading("'fonts/Marker Felt.ttf'");
    }
    else
    {
        // position the label on the center of the screen
        label->setPosition(Vec2(origin.x + visibleSize.width/2,
                                origin.y + visibleSize.height - label->getContentSize().height));

        // add the label as a child to this layer
        this->addChild(label, 1);
    }

    float posY = origin.y + visibleSize.height;
    // deltaTimeLb
    deltaTimeLb = Label::createWithTTF("hello world scene is updating, delta time = deltaTimeLb   0", "fonts/Marker Felt.ttf", 24);
    if (deltaTimeLb == nullptr)
    {
        problemLoading("'fonts/Marker Felt.ttf'");
    }
    else
    {
        deltaTimeLb->setAnchorPoint(cocos2d::Vec2(0.0f, 1.0f));
        deltaTimeLb->setWidth(120);
        auto lbSize = deltaTimeLb->getContentSize();
        // position the label on the center of the screen
        deltaTimeLb->setPosition(Vec2(origin.x + 20.0f, posY));
        posY -= lbSize.height + 200;

        // add the label as a child to this layer
        this->addChild(deltaTimeLb, 1);
    }

    // deltaTimeLb2
    deltaTimeLb2 = Label::createWithTTF("deltaTimeLb2       00", "fonts/Marker Felt.ttf", 24);
    if (deltaTimeLb2 == nullptr)
    {
        problemLoading("'fonts/Marker Felt.ttf'");
    }
    else
    {
        deltaTimeLb2->setAnchorPoint(cocos2d::Vec2(0.0f, 1.0f));
        deltaTimeLb2->setWidth(120);
        auto lbSize = deltaTimeLb2->getContentSize();
        // position the label on the center of the screen
        deltaTimeLb2->setPosition(Vec2(origin.x + 20.0f, posY));
        posY -= lbSize.height + 200;

        // add the label as a child to this layer
        this->addChild(deltaTimeLb2, 1);
    }

    // deltaTimeLb3
    deltaTimeLb3 = Label::createWithTTF("deltaTimeLb3       00", "fonts/Marker Felt.ttf", 24);
    if (deltaTimeLb3 == nullptr)
    {
        problemLoading("'fonts/Marker Felt.ttf'");
    }
    else
    {
        deltaTimeLb3->setAnchorPoint(cocos2d::Vec2(0.0f, 1.0f));
        deltaTimeLb3->setWidth(120);
        auto lbSize = deltaTimeLb3->getContentSize();
        // position the label on the center of the screen
        deltaTimeLb3->setPosition(Vec2(origin.x + 20.0f, posY));
        posY -= lbSize.height + 200;

        // add the label as a child to this layer
        this->addChild(deltaTimeLb3, 1);
    }

    // add "HelloWorld" splash screen"
    auto sprite = Sprite::create("HelloWorld.png");
    if (sprite == nullptr)
    {
        problemLoading("'HelloWorld.png'");
    }
    else
    {
        // position the sprite on the center of the screen
        sprite->setPosition(Vec2(visibleSize.width/2 + origin.x, visibleSize.height/2 + origin.y));

        // add the sprite as a child to this layer
        this->addChild(sprite, 0);
    }

    //event test
    _eventTest = new (std::nothrow) cocos2d::EventCustom(EVENT_TEST);
    auto _listener = EventListenerCustom::create(EVENT_TEST, std::bind(&HelloWorld::onEventTest, this, std::placeholders::_1));
    _eventDispatcher->addEventListenerWithSceneGraphPriority(_listener, this);

    //event test 2
    auto _listener2 = EventListenerCustom::create(EVENT_TEST2, [=](EventCustom* event) {
        if (deltaTimeLb != nullptr)
        {
            static int eventCnt = 0;
            deltaTimeLb2->setString("event test2 " + std::to_string(eventCnt++));
        }
    });
    _eventDispatcher->addEventListenerWithSceneGraphPriority(_listener2, this);


    // event test listener3
    auto _listener3 = EventListenerCustom::create(EVENT_TEST, [=](EventCustom* event) {
        if (deltaTimeLb != nullptr)
        {
            static int eventCnt = 0;
            deltaTimeLb3->setString("event test to listener3 " + std::to_string(eventCnt++));
        }
        });
    _eventDispatcher->addEventListenerWithSceneGraphPriority(_listener3, this);

    // 注册update
    scheduleUpdate();

    return true;
}


void HelloWorld::menuCloseCallback(Ref* pSender)
{
    //Close the cocos2d-x game scene and quit the application
    Director::getInstance()->end();

    /*To navigate back to native iOS screen(if present) without quitting the application  ,do not use Director::getInstance()->end() as given above,instead trigger a custom event created in RootViewController.mm as below*/

    //EventCustom customEndEvent("game_scene_close_event");
    //_eventDispatcher->dispatchEvent(&customEndEvent);


}

 void HelloWorld::update(float delta) 
{
     printf("hello world update, delta: %.4f\n", delta);
     _eventTest->setUserData(&delta);
     _eventDispatcher->dispatchEvent(_eventTest);

     EventCustom event2(EVENT_TEST2);
     _eventDispatcher->dispatchEvent(&event2);
}

void HelloWorld::onEventTest(cocos2d::EventCustom* event)
{
    std::string str = "hello world scene is updating, delta time = ";
    float* dt = (float*)(event->getUserData());
    // 使用 std::stringstream 进行格式化
    std::stringstream stream;
    stream << std::fixed << std::setprecision(8) << *dt; // 保留两位小数
    str += stream.str();

    if (deltaTimeLb != nullptr)
    {
        deltaTimeLb->setString(str);
    }
}
