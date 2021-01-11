(ns life.frontend.test
  (:require
   [life.frontend.app :refer [tick neighbors]]
   [clojure.test :refer [deftest is run-tests]]))

(deftest root-neighbors
  (let [cell {:row 0 :col 0}]
    (is (= (neighbors cell)
           [
            {:row 1 :col 0}
            {:row 0 :col 1}
            {:row -1 :col 0}
            {:row 0 :col -1}
            {:row 1 :col 1}
            {:row -1 :col -1}
            {:row 1 :col -1}
            {:row -1 :col 1}
            ]))))

(deftest bi-block
  (let [board #{{:row 0 :col 0}
               {:row 1 :col 0}
               {:row 0 :col 1}
               {:row 1 :col 1}}]
    (is (= (tick board) board))))

(deftest blinker
  (let [board #{{:row 1 :col 0}
               {:row 1 :col 1}
               {:row 1 :col 2}}]
    (is (= (tick board) #{{:row 0 :col 1}
                         {:row 1 :col 1}
                         {:row 2 :col 1}}))))

(deftest blinker-resets
  (let [board #{{:row 1 :col 0}
               {:row 1 :col 1}
               {:row 1 :col 2}}]
    (is (= board (tick (tick board))))))

(defn init []
  (run-tests))
