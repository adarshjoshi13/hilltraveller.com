import React, { useState } from 'react'
import {Button, Layout, theme} from 'antd'
import {MenuUnfoldOutlined , MenuFoldOutlined} from "@ant-design/icons"
import "./AdminNavbar.css"
// import Logo from './Logo/logo';
import MenuList from './MenuList/MenuList';
import ToggleThemeBtn from './ToggleTheme/ToggleThemeBtn';
import { ViewAllCards } from '../../export';
const {Header, Sider} = Layout;

function AdminNavbar() {
  const [darkTheme, setDarkTheme] = useState(true)
  const [closed , setClosed] = useState(false)

const toggleTheme =()=>{
  setDarkTheme(!darkTheme)
}
const {
  token : {colorBgContainer},
} = theme.useToken()

  return (
<>
   <Layout className='sidenav'>
    <Sider collapsed={closed} trigger={null} collapsible theme={darkTheme ? "dark" : "light"} className='side'>
        <Logo themeWhat={darkTheme}/>
        <MenuList darkThemes={darkTheme}/>
        <ToggleThemeBtn darkTheme={darkTheme} toggleTheme={toggleTheme}/>
        </Sider>
        
        <Layout>
          <Header style={{padding : 0, background : colorBgContainer ,width : "100px"}}>
            <Button className='admin-nav-btn' style={{position:"relative",zIndex:"3" ,background:"white"}}
            onClick={()=> setClosed(!closed)}
            type='text' icon={
            closed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined/>
            }/>
          </Header>
            {/* <ViewAllCards/> */}
        </Layout>
       
   </Layout>
   
   </>
  )
}

export default AdminNavbar