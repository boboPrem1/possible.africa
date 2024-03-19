/* eslint-disable no-unused-vars */

import { Link, Outlet, Link as ReachLink } from "react-router-dom";
import Logo from "../assets/LogoPossible.png";
import LogoExa from "../assets/logoEXA.svg";
import { MenuIcon } from "../assets/icons";

import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Image,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import CustomLink from "./CustomLink";
import Searchbar from "./Searchbar";

export const Header = () => {
  const isDesktop = useBreakpointValue({
    base: false,
    lg: true,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [placement, setPlacement] = useState("right");
  return (
    <>
      <Container
        as="section"
        pb={{
          base: "1",
          md: "5",
        }}
        py={{
          base: "4",
          lg: "6",
        }}
        minW={{ base: "100vw", lg: "container.xl" }}
      >
        <Box as="nav" bg="bg-surface" minW="100%">
          <Flex
            gap={{ base: "8", md: "180" }}
            justifyContent={{ base: "center", md: "flex-start" }}
            alignItems={{ base: "center", md: "space-between" }}
            direction={{
              base: "column",
              md: "row",
            }}
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Link to="/">
                <Box w="100px">
                  <Image src={Logo} fit="contain" w="100%" h="100%" />
                </Box>
              </Link>
            </Flex>

            <Flex
              w={{ base: "100%", md: "70%" }}
              alignItems="center"
              justifyContent="center"
              alignContent="center"
            >
              <div className="font-black text-2xl text-center text-neutral-500 uppercase">
                L'univers des possibles de l'#AfricaTech
              </div>
              {/* <Searchbar zIndex={100} /> */}
            </Flex>

            <Flex justifyContent="space-between" alignItems="center">
              <Link to="https://expand-in-africa.com" target="_blank">
                <Box w="100px">
                  <div className="text-center py-1 uppercase font-bold text-sm">
                    Powered by
                  </div>
                  <Image src={LogoExa} fit="contain" w="100%" h="100%" />
                </Box>
              </Link>
            </Flex>
          </Flex>
        </Box>
      </Container>
      <Outlet />
    </>
  );
};
