import React, { useEffect, useState } from "react";
import { firestore } from "../../firebase/config";
import Navigation from "../layout/Navigation";
import PrimaryColumn from "../PrimaryColumn/PrimaryColumn";
import Header from "../PrimaryColumn/Header";
import Timeline from "../PrimaryColumn/Timeline";
import SecondaryColumn from "../SecondaryColumn/SecondaryColumn";
import Search from "../SecondaryColumn/Search";
import Activity from "../SecondaryColumn/Activity";
import FollowMenu from "../SecondaryColumn/FollowMenu";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "flex-start",
    "&::before, &::after": {
      content: '""',
      margin: "auto",
    },
  },
}));

export default function Explore() {
  const [timeline, setTimeline] = useState(null);

  const classes = useStyles();

  useEffect(() => {
    const unsubscribe = firestore
      .collection("tweets")
      .where("parent", "==", null)
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setTimeline(
          snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          })
        );
      });

    return () => unsubscribe();
  }, []);

  return (
    <Container className={classes.root}>
      <Navigation />

      <PrimaryColumn>
        <Header title="Explore" />
        <Timeline tweets={timeline} />
      </PrimaryColumn>

      <SecondaryColumn>
        <Search />
        <Activity />
        <FollowMenu />
      </SecondaryColumn>
    </Container>
  );
}
