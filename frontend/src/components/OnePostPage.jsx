/* eslint-disable react/prop-types */

import {
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import ArrowLeftSolidCustomIcon from "./icons/ArrowLeftSolidCustomIcon.jsx";

import { ParseIframe } from "../utils/htmlParser.jsx";
import Socialshare from "./Socialshare.jsx";
import { HourGlassIcon } from "../assets/icons.jsx";

function OnePostPage({ iconSx, backUrl, news }) {
  const date = new Date(news?.createdAt);
  const publishedDate =
    date.toLocaleString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }) || "";
  const content = news?.content && ParseIframe(news?.content);

  function estimateReadingTime() {
    const wordsPerMinute = 200; // Change this value according to your preference

    const wordCount = news?.content
      ? news?.content?.trim()?.split(/\s+/)?.length
      : "Pas de contenu".trim().split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);

    return readingTimeMinutes;
  }

  return (
    <Container maxW="container.lg" p={0}>
      <Flex ml={10}>
        <ArrowLeftSolidCustomIcon sx={iconSx} backUrl={backUrl} mr="1" mt={5} />
      </Flex>

      <Flex py={0} direction={{ base: "column", md: "row" }}>
        <VStack
          w={{ base: "100%", md: "75%" }}
          h="full"
          p={10}
          spacing={10}
          alignItems="center"
        >
          {/* <Flex><ArrowLeftSolidCustomIcon sx={iconSx} backUrl={backUrl}/></Flex> */}
          <Box>
            <Flex>
              {/* {news?.categorie?.name && <Badge colorScheme="green" p={2} borderRadius={50} marginBottom={3}>{news?.categorie?.name}</Badge>} */}
            </Flex>
            <Heading fontSize={{ base: "xl", md: "4xl" }}>
              {news?.title}
            </Heading>
          </Box>

          <Flex w="full">
            <Flex
              w="full"
              h="full"
              gap={{ base: "24px" }}
              flexDirection={{ base: "column", md: "row" }}
              alignItems="flex-start"
              justifyContent="space-between"
            >
              <HStack alignItems="center">
                <Box width="50px" overflow="hidden" borderRadius="full">
                  <Image
                    src={news?.user?.avatar}
                    w="100%"
                    fit="cover"
                    borderRadius="full"
                    alt="image"
                    fallbackSrc="/placeholder.png"
                  />
                </Box>
                <Box w="full">
                  <Flex direction="column" justify="space-around" gap={1}>
                    {news?.user?.firstname ||
                      (news?.user?.firstname && (
                        <Heading size="xs" fontWeight={500}>
                          {news?.user?.firstname} {news?.user?.lastname}
                        </Heading>
                      )) || (
                        <Heading size="sm" fontWeight={500}>
                          {" "}
                          {"Auteur inconnu"}
                        </Heading>
                      )}
                    <Flex justify="flex-start" color="gray.500">
                      {publishedDate ? (
                        <Box fontSize="sm" mr={4}>
                          <Text fontSize="14px">{publishedDate}</Text>{" "}
                        </Box>
                      ) : (
                        <Box fontSize="sm" mr={4}>
                          <Text>{""}</Text>
                        </Box>
                      )}

                      <Flex>
                        {(estimateReadingTime() && (
                          <Box fontSize="sm">
                            <Text fontSize="14px">
                              {estimateReadingTime()} min de lecture{" "}
                            </Text>
                          </Box>
                        )) ||
                          ""}
                      </Flex>
                    </Flex>
                  </Flex>
                </Box>
              </HStack>
              <Socialshare />
            </Flex>
          </Flex>

          <Box as="main">{content ?? "Pas de contenu"}</Box>
        </VStack>
        <VStack
          w={{ base: "100%", md: "25%" }}
          h="full"
          p={10}
          spacing={10}
          alignItems="flex-start"
        ></VStack>
      </Flex>
    </Container>
  );
}

export default OnePostPage;
