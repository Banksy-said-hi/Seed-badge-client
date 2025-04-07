import { http, HttpResponse } from "msw";
import eventsData from "./data/events.json";
import invitesData from "./data/invites.json";
import rewardsData from "./data/rewards.json";

export const handlers = [
  http.get("/api/events", () => {
    return HttpResponse.json(eventsData.events);
  }),
  http.get("/api/invites", () => {
    return HttpResponse.json(invitesData.invites);
  }),
  http.get("/api/rewards", () => {
    return HttpResponse.json(rewardsData.rewards);
  }),
];
