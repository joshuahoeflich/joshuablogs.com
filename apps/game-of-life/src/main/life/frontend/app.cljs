(ns life.frontend.app)

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
  (let [cells (distinct (mapcat neighbors board))
        is-living? (partial contains? board)
        is-dead? (complement is-living?)
        live-neighbors (fn [cell] (count (filter is-living? (neighbors cell))))
        in-new-board?
        (fn [cell]
          (let [neighbor-count (live-neighbors cell)]
            (if (is-living? cell)
              (or (= neighbor-count 2) (= neighbor-count 3))
              (= neighbor-count 3))))
        ]
    (into #{} (filter in-new-board? cells))))

(defn init []
  (let [board #{{:x 3 :y 4}}]
    (println (contains? board {:x 3 :y 4}))
    (println (contains? board {:x 3 :y 5}))
    (println (conj board {:x 3 :y 4}))
    (println (conj board {:x 3 :y 5}))))
