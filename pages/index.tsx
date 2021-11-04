import { Container, Typography, Box, Button } from "@material-ui/core";
import Link from "next/link";

export default function Index() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Helloooo world
        </Typography>
        <Link href="/streams" passHref>
          <Button variant="contained" color="primary">
            Go to Streams page
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
