import { TQuiz, TQuizResponse } from "@/types/quiz";
import { NextApiRequest, NextApiResponse } from "next";

const questionAndAnswers: TQuiz[] = [
  {
    id: 1,
    question: "1+1 ?",
    options: ["1", "2", "3", "4"],
    answer: "2",
  },
  {
    id: 1,
    question: "2+2 ?",
    options: ["1", "2", "3", "4"],
    answer: "4",
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TQuizResponse>
) {
  try {
    const { page } = req.query as { page: string };

    if (!page) {
      res.send(questionAndAnswers);
    }
    let pageToNum = parseInt(page);
    const quiz = questionAndAnswers[pageToNum];
    const lastPage = questionAndAnswers.length - 1;
    const numOfQustions = questionAndAnswers.length;

    if (pageToNum === 0) {
      res.send({
        prev: false,
        next: true,
        page,
        quiz,
        total: numOfQustions,
      });
    } else if (pageToNum === lastPage) {
      res.send({
        prev: true,
        next: false,
        page,
        quiz,
        total: numOfQustions,
      });
    } else {
      res.send({
        prev: true,
        next: true,
        page,
        quiz,
        total: numOfQustions,
      });
    }
  } catch (error) {}
}
