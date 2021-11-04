import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { initializeApollo } from "lib/apollo";
import { useEditStreamMutation } from "lib/graphql/editStream.graphql";
import { useDeleteStreamMutation } from "lib/graphql/deleteStream.graphql";
import { StreamDocument } from "lib/graphql/stream.graphql";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

export default function EditStream({ id }) {
  const router = useRouter();
  const [editStream] = useEditStreamMutation();
  const [deleteStream] = useDeleteStreamMutation();
  const [_id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const fetchStream = async () => {
    const apollo = initializeApollo();
    const { data } = await apollo.query({
      query: StreamDocument,
      variables: { streamId: id },
    });
    const { _id, title, description, url } = data.stream;
    setId(_id);
    setTitle(title);
    setDescription(description);
    setUrl(url);
  };

  useEffect(() => {
    fetchStream();
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(title);

    try {
      const { data } = await editStream({
        variables: { input: { id: _id, title, description, url } },
      });
      if (data.editStream._id) {
        router.push("/streams");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onDelete = async (event) => {
    event.preventDefault();

    try {
      const { data } = await deleteStream({
        variables: { streamId: _id },
      });
      if (data.deleteStream) {
        router.push("/streams");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4">Edit Stream</Typography>
        <form onSubmit={onSubmit}>
          <Box pb={2.5} />
          <TextField
            autoFocus
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Box pb={2.5} />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Box pb={2.5} />
          <TextField
            label="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <Box pb={2.5} />
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
          <Box pb={2.5} />
          <Button onClick={onDelete} variant="contained">
            Delete
          </Button>
        </form>
      </Box>
    </Container>
  );
}

EditStream.getInitialProps = async ({ query: { id } }) => {
  return { id };
};
