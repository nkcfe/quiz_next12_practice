import { TSavedAnswer } from "@/types/quiz";
import Link from "next/link";
import React, { useState } from "react";
import useSWR from "swr";
import styles from "@/styles/Quiz.module.css";

const Quiz = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [answered, setAnswered] = useState<TSavedAnswer>({});

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, error } = useSWR(`/api/quiz?page=${pageIndex}`, fetcher);

  if (error)
    return (
      <div>
        <h3>에러가 발생했습니다.</h3>
      </div>
    );

  if (!data)
    return (
      <div>
        <h3>로딩중...</h3>
      </div>
    );

  const { quiz, next, prev, page, total } = data;

  const addAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const latestAnswer = { ...answered, [name]: value };
    setAnswered(latestAnswer);
    localStorage.setItem("answered", JSON.stringify(latestAnswer));
  };

  return (
    <>
      <div className={styles.info}>
        <p>
          {parseInt(page) + 1} of {total}
        </p>
      </div>
      <div>
        <div>
          <p>{quiz.question}</p>
        </div>
        <ul>
          {quiz.options.map((option: string, index: number) => (
            <li key={index} className={styles.option}>
              <input
                type="radio"
                name={quiz.id.toString()}
                onChange={(e) => addAnswer(e)}
                value={option}
                checked={answered[quiz.id] === option}
              />
              {option}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.navBtns}>
        {prev ? (
          <button onClick={() => setPageIndex(pageIndex - 1)}>이전 문제</button>
        ) : (
          <Link href="/">취소</Link>
        )}
        {next ? (
          <button
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={answered[quiz.id] === undefined}
            className={
              answered[quiz.id] !== undefined ? "disabledBtn" : "activeBtn"
            }
          >
            다음 문제
          </button>
        ) : (
          answered[quiz.id] !== undefined && <Link href="/result">끝</Link>
        )}
      </div>
    </>
  );
};

export default Quiz;
