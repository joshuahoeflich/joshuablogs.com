(ns life.frontend.app)

(def canvas (atom (js/document.getElementById "game")))

(defn neighbors [cell]
  (let [{row :row col :col} cell]
    [{:row (inc row) :col       col}
     {:row row       :col (inc col)}
     {:row (dec row) :col       col}
     {:row row       :col (dec col)}
     {:row (inc row) :col (inc col)}
     {:row (dec row) :col (dec col)}
     {:row (inc row) :col (dec col)}
     {:row (dec row) :col (inc col)}]))

(defn tick [board]
  (letfn [(alive? [cell] (contains? board cell))
          (in-new-board? [cell]
            (let [neighbor-count (count (filter alive? (neighbors cell)))]
              (or (= neighbor-count 3)
                  (and (alive? cell) (= neighbor-count 2)))))]
    (into #{} (filter in-new-board? (distinct (mapcat neighbors board))))))

(defn init []
  (let [board #{{:x 3 :y 4}}]
    (println (contains? board {:x 3 :y 4}))
    (println (contains? board {:x 3 :y 5}))
    (println (conj board {:x 3 :y 4}))
    (println (conj board {:x 3 :y 5}))))
