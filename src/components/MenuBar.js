import React, { useState,useEffect,useContext } from 'react'
import {Link} from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import {AuthContext} from '../context/auth'


const MenuBar = () => {
    const {user,logout} = useContext(AuthContext)
    const pathname = window.location.pathname
    const [activeItem, setActiveItem] = useState()

    useEffect(() => {
        const path = pathname === '/' ? 'home' : pathname.substr(1)
        setActiveItem(path)
    },[pathname])


    const handleItemClick = (e, { name }) => setActiveItem(name)

    const menuBar = user ? (
        <Menu pointing secondary size="massive" color="teal">
            <Menu.Item
                name={user.username}
                active
                as={Link}
                to={'/'}
            /> 
            <Menu.Menu position='right'>
                <Menu.Item
                    name='logout'
                    onClick={logout}
                    as={Link}
                    to={'/login'}
                />
            </Menu.Menu>
        </Menu>
    ) : (
        <Menu pointing secondary size="massive" color="teal">
            <Menu.Item
                name='home'
                active={activeItem === 'home'}
                onClick={handleItemClick}
                as={Link}
                to={'/'}
            /> 
            <Menu.Menu position='right'>
                <Menu.Item
                    name='login'
                    active={activeItem === 'login'}
                    onClick={handleItemClick}
                    as={Link}
                    to={'/login'}
                />
                <Menu.Item
                    name='register'
                    active={activeItem === 'register'}
                    onClick={handleItemClick}
                    as={Link}
                    to={'/register'}
                />
            </Menu.Menu>
        </Menu>
    )

    return menuBar
}
export default MenuBar