import fotex from "../design/fotex.jpg";
import flammen from "../design/flammen.jpg";
import booking from "../design/booking.png";
import elgiganten from "../design/elgiganten.jpg";
import power from "../design/Power.jpg";
import jysk from "../design/jysk.jpg";

export interface Card {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  points: number;
  imageAlign: number;
}

export const cardData = [
    {
      id: 1,
      title: "Spar 50% på din næste banan.",
      description: "Føtex",
      imageSrc: fotex,
      points: 30,
      imageAlign: -190,
    },
    {
      id: 2,
      title: "10% på hele regningen + gratis desert",
      description: "Flammen",
      imageSrc: flammen,
      points: 50,
      imageAlign: 0,
    },
    {
      id: 3,
      title: "Spar 25% på din næste booking!",
      description: "Booking.com",
      imageSrc: booking,
      points: 60,
      imageAlign: -165,
    },
    {
      id: 4,
      title: "Gratis Calman-kalibrering ved næste køb af TV.",
      description: "Elgiganten",
      imageSrc: elgiganten,
      points: 40,
      imageAlign: -85,
    },
    {
      id: 5,
      title: "Spar 30% på din næste vaskemaskine.",
      description: "Power",
      imageSrc: power,
      points: 60,
      imageAlign: -62,
    },
    {
      id: 6,
      title: "Gratis hovedpude ved køb af næste seng.",
      description: "Jysk",
      imageSrc: jysk,
      points: 10,
      imageAlign: -160,
    },
  ];