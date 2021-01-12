(ns life.frontend.app-test
  (:require
   [life.frontend.app :refer [tick neighbors extract-grid]]
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

(deftest glider
  (let [board #{{:row 0 :col 1}
               {:row 1 :col 2}
               {:row 2 :col 0}
               {:row 2 :col 1}
               {:row 2 :col 2}}]
    (is (= (tick board)
           #{{:row 1 :col 0}
            {:row 1 :col 2}
            {:row 2 :col 1}
            {:row 2 :col 2}
            {:row 3 :col 1}}))))

(defn add-canvas-to-doc! []
  "Create a canvas for the tests."
  (let [canvas (js/document.createElement "canvas")
        body (js/document.querySelector "body")]
    (.appendChild body canvas)
    (set! canvas.width 100)
    (set! canvas.height 100)
    (set! canvas.id "game")))

(add-canvas-to-doc!)

(deftest grid-dimensions
  (is (= 100
         (:width (extract-grid (js/document.getElementById "game"))))))
