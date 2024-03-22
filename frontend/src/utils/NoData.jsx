import {
  Button,
  Container,
  Heading,
  SlideFade,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";

function NoData() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <SlideFade in={onToggle}>
      <Container
        display="flex"
        maxW="container.lg"
        minH="45vh"
        p={0}
        alignItems="center"
        justifyContent="center"
      >
        <VStack
          w="full"
          h="100%"
          py={4}
          px={{ base: "30px", md: "" }}
          gap="4"
          alignItems="center"
          alignContent="center"
        >
          <Heading fontSize={{ base: "xl", md: "2xl" }}>
            Pas encore d'infos!
          </Heading>

          <Button _hover={{ bg: "teal.600" }} as="a" href="">
            Ajoutez-en
          </Button>
        </VStack>
      </Container>
    </SlideFade>
  );
}

export default NoData;
