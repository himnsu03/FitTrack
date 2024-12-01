import React, { useState } from "react";
import axios from 'axios'; 
import styled from "styled-components";
import LogoImg from "../utils/Images/Logo.png";
import { Link as LinkR, NavLink } from "react-router-dom";
import { MenuRounded } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducers/userSlice";

const Nav = styled.div`
  background-color: ${({ theme }) => theme.bg};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  color: white;
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary + 20};
`;
const NavContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
`;
const NavLogo = styled(LinkR)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 6px;
  font-weight: 600;
  font-size: 18px;
  text-decoration: none;
  color: ${({ theme }) => theme.black};
`;
const Logo = styled.img`
  height: 42px;
`;
const Mobileicon = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const NavItems = styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 0 6px;
  list-style: none;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const Navlink = styled(NavLink)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  transition: all 1s slide-in;
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  &.active {
    color: ${({ theme }) => theme.primary};
    border-bottom: 1.8px solid ${({ theme }) => theme.primary};
  }
`;

const UserContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  align-items: center;
  padding: 0 6px;
  color: ${({ theme }) => theme.primary};
`;
const TextButton = styled.div`
  text-align: end;
  color: ${({ theme }) => theme.secondary};
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  font-weight: 600;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const MobileMenu = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  padding: 0 6px;
  list-style: none;
  width: 90%;
  padding: 12px 40px 24px 40px;
  background: ${({ theme }) => theme.bg};
  position: absolute;
  top: 80px;
  right: 0;
  transition: all 0.6s ease-in-out;
  transform: ${({ isOpen }) =>
    isOpen ? "translateY(0)" : "translateY(-100%)"};
  border-radius: 0 0 20px 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  opacity: ${({ isOpen }) => (isOpen ? "100%" : "0")};
  z-index: ${({ isOpen }) => (isOpen ? "1000" : "-1000")};
`;

const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: ${({ theme }) => theme.bg};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1000;
`;

const ChatbotWindow = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  background-color: ${({ theme }) => theme.bg};
  width: 300px;
  height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: ${({ open }) => (open ? "block" : "none")};
  z-index: 999;
`;

const ChatMessageContainer = styled.div`
  height: 90%;
  overflow-y: scroll;
  padding: 10px;
`;

const ChatInput = styled.input`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  margin-top: 10px;
`;

const Navbar = ({ currentUser }) => {
  const dispatch = useDispatch();
  const [isOpen, setisOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

 
  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { user: true, text: input }]);
      setInput("");
    
      try {
        const response = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyD0eqaH3af_0vh3atW4pzT9soyG3u3abqA',
          {
            contents: [
              {
                parts: [{ text: input }]
              }
            ]
          }
        );
    
        const botMessage = response.data.candidates[0]?.content?.parts[0]?.text;
    
        if (botMessage) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { user: false, text: botMessage }
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { user: false, text: "Sorry, I couldn't understand the response." }
          ]);
        }
      } catch (error) {
        console.error("Error details:", error.response || error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: false, text: "Sorry, I'm having trouble connecting right now." }
        ]);
      }
    }
  };
  
  
  
  

  return (
    <Nav>
      <NavContainer>
        <Mobileicon onClick={() => setisOpen(!isOpen)}>
          <MenuRounded sx={{ color: "inherit" }} />
        </Mobileicon>
        <NavLogo to="/">
          <Logo src={LogoImg} />
          Fittrack
        </NavLogo>

        <MobileMenu isOpen={isOpen}>
          <Navlink to="/">Dashboard</Navlink>
          <Navlink to="/workouts">Workouts</Navlink>
          <Navlink to="/tutorials">Tutorials</Navlink>
          <Navlink to="/blogs">Blogs</Navlink>
        </MobileMenu>

        <NavItems>
          <Navlink to="/">Dashboard</Navlink>
          <Navlink to="/workouts">Workouts</Navlink>
          <Navlink to="/tutorials">Tutorials</Navlink>
          <Navlink to="/blogs">Blogs</Navlink>
        </NavItems>

        <UserContainer>
          <Avatar src={currentUser?.img}>{currentUser?.name[0]}</Avatar>
          <TextButton onClick={() => dispatch(logout())}>Logout</TextButton>
        </UserContainer>
      </NavContainer>

      {/* Chatbot UI */}
      <ChatbotContainer onClick={() => setChatbotOpen(!chatbotOpen)}>
        💬
      </ChatbotContainer>

      <ChatbotWindow open={chatbotOpen}>
        <ChatMessageContainer>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.user ? "right" : "left",
                margin: "10px 0",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "10px",
                  backgroundColor: msg.user ? "#007bff" : "#f1f1f1",
                  color: msg.user ? "#fff" : "#000",
                  borderRadius: "10px",
                  maxWidth: "80%",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </ChatMessageContainer>
        <ChatInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message..."
        />
      </ChatbotWindow>
    </Nav>
  );
};

export default Navbar;
