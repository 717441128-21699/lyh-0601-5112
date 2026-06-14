import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
// 全局样式
import './app.scss';

function App(props) {
  const initFromStorage = useAppStore(state => state.initFromStorage)

  useEffect(() => {
    console.log('[App] 应用启动，初始化数据')
    initFromStorage()
  }, [initFromStorage]);

  // 对应 onShow
  useDidShow(() => {
    console.log('[App] 应用显示')
  });

  // 对应 onHide
  useDidHide(() => {
    console.log('[App] 应用隐藏')
  });

  return props.children;
}

export default App;
