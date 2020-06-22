import React, { Fragment, useEffect, useState, SyntheticEvent } from "react";
import { Container } from "semantic-ui-react";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import NavBar from "../../features/nav/NavBar";
import Activities from "../api/agent";
import { IActivity } from "../models/activity";
import LoadingComponent from "./LoadingComponent";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmittin] = useState(false);
  const [target, setTargrt] = useState("");

  const handleSelectedActivity = (id: string) => {
    setSelectedActivity(activities.filter((a) => a.id === id)[0]);
    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = (activity: IActivity) => {
    setSubmittin(true);
    Activities.create(activity)
      .then(() => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
      })
      .then(() => setSubmittin(false));
  };

  const handleEditActivity = (activity: IActivity) => {
    setSubmittin(true);
    Activities.update(activity)
      .then(() => {
        setActivities([
          ...activities.filter((a) => a.id !== activity.id),
          activity,
        ]);
        setSelectedActivity(activity);
        setEditMode(false);
      })
      .then(() => setSubmittin(false));
  };

  const handleDelete = (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    setSubmittin(true);
    setTargrt(event.currentTarget.name);
    Activities.delete(id)
      .then(() => {
        setActivities([...activities.filter((a) => a.id !== id)]);
      })
      .then(() => setSubmittin(false));
  };

  useEffect(() => {
    Activities.list()
      .then((response) => {
        let activities: IActivity[] = [];
        response.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          activities.push(activity);
        });
        setActivities(activities);
      })
      .then(() => setLoading(false));
  }, []);

  if (loading) return <LoadingComponent content={"Loading activity ..."} />;
  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectedActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDelete}
          submitting={submitting}
          target={target}
        />
      </Container>
    </Fragment>
  );
};

export default App;
