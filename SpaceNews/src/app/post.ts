export interface Post {
  id : number,
  idTopic : number,
  title : string,
  url : string,
  time : Date,
  author : string,
  counter : string,
  location : string,
  group : string,
  content : string,
  piority : boolean
}
export let listPost : Post[]= [
  {
      id : 1,
      idTopic : 1,
      title : "Rijeka begins year of European Capital of",
      url : '/assets/img/event-img/event1.png',
      time : new Date('2023-5-1'),
      author : 'EuroNews',
      counter : '4 min read',
      location : 'Meeting room c201',
      group : 'Program c201',
      content : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo numquam aut dolorum perspiciatis dolor eaque neque ullam, sint culpa temporibus itaque aliquam! Quam, minus animi aperiam reiciendis est nobis inventore!\
Delectus, placeat iure itaque hic harum labore quos repellat soluta aperiam cum quis numquam autem sint magni praesentium minus ducimus dolor quia cupiditate atque voluptas. Tempore iste dignissimos laborum debitis?\
Ea in fuga quae officiis consequuntur reprehenderit dolor incidunt impedit cum vel, tempore beatae eaque, fugit quaerat voluptates dolorum necessitatibus ipsa asperiores doloribus recusandae. Nesciunt consequatur ut vitae blanditiis nobis.\
Doloribus deleniti officia dicta velit voluptas est, odit numquam optio pariatur, doloremque, temporibus odio voluptatem voluptatibus ex. Omnis magnam saepe perferendis beatae id quo sed, quas, incidunt modi quia sequi.\
Deserunt modi asperiores a tempora officia reiciendis natus, fugiat voluptatem. Repudiandae saepe cupiditate explicabo? Atque itaque quas aspernatur corporis quaerat in dolorum distinctio harum ea. Repudiandae ipsum quasi ad ullam.Deserunt modi asperiores a tempora officia reiciendis natus, fugiat voluptatem. Repudiandae saepe cupiditate explicabo? Atque itaque quas aspernatur corporis quaerat in dolorum distinctio harum ea. Repudiandae ipsum quasi ad ullam.',
      piority : true
    },
    {
      id : 2,
      idTopic : 2,
      title : "Rijeka begins year of European Capital of",
      url : '/assets/img/event-img/event2.png',
      time : new Date('2023-5-9'),
      author : 'EuroNews',
      counter : '4 min read',
      location : 'Meeting room c201',
      group : 'Program c201',
      content : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo numquam aut dolorum perspiciatis dolor eaque neque ullam, sint culpa temporibus itaque aliquam! Quam, minus animi aperiam reiciendis est nobis inventore!\
Delectus, placeat iure itaque hic harum labore quos repellat soluta aperiam cum quis numquam autem sint magni praesentium minus ducimus dolor quia cupiditate atque voluptas. Tempore iste dignissimos laborum debitis?\
Ea in fuga quae officiis consequuntur reprehenderit dolor incidunt impedit cum vel, tempore beatae eaque, fugit quaerat voluptates dolorum necessitatibus ipsa asperiores doloribus recusandae. Nesciunt consequatur ut vitae blanditiis nobis.\
Doloribus deleniti officia dicta velit voluptas est, odit numquam optio pariatur, doloremque, temporibus odio voluptatem voluptatibus ex. Omnis magnam saepe perferendis beatae id quo sed, quas, incidunt modi quia sequi.\
Deserunt modi asperiores a tempora officia reiciendis natus, fugiat voluptatem. Repudiandae saepe cupiditate explicabo? Atque itaque quas aspernatur corporis quaerat in dolorum distinctio harum ea. Repudiandae ipsum quasi ad ullam.Deserunt modi asperiores a tempora officia reiciendis natus, fugiat voluptatem. Repudiandae saepe cupiditate explicabo? Atque itaque quas aspernatur corporis quaerat in dolorum distinctio harum ea. Repudiandae ipsum quasi ad ullam.',
      piority : true
    },
    {
      id : 3,
      title : "Rijeka begins year of European Capital of",
      idTopic : 3,
      url : '/assets/img/event-img/event3.png',
      time : new Date('2023-5-19'), //6
      author : 'EuroNews',
      counter : '4 min read',
      location : 'Meeting room c201',
      group : 'Program c201',
      content : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo numquam aut dolorum perspiciatis dolor eaque neque ullam, sint culpa temporibus itaque aliquam! Quam, minus animi aperiam reiciendis est nobis inventore!\
Delectus, placeat iure itaque hic harum labore quos repellat soluta aperiam cum quis numquam autem sint magni praesentium minus ducimus dolor quia cupiditate atque voluptas. Tempore iste dignissimos laborum debitis?\
Ea in fuga quae officiis consequuntur reprehenderit dolor incidunt impedit cum vel, tempore beatae eaque, fugit quaerat voluptates dolorum necessitatibus ipsa asperiores doloribus recusandae. Nesciunt consequatur ut vitae blanditiis nobis.\
Doloribus deleniti officia dicta velit voluptas est, odit numquam optio pariatur, doloremque, temporibus odio voluptatem voluptatibus ex. Omnis magnam saepe perferendis beatae id quo sed, quas, incidunt modi quia sequi.\
Deserunt modi asperiores a tempora officia reiciendis natus, fugiat voluptatem. Repudiandae saepe cupiditate explicabo? Atque itaque quas aspernatur corporis quaerat in dolorum distinctio harum ea. Repudiandae ipsum quasi ad ullam.Deserunt modi asperiores a tempora officia reiciendis natus, fugiat voluptatem. Repudiandae saepe cupiditate explicabo? Atque itaque quas aspernatur corporis quaerat in dolorum distinctio harum ea. Repudiandae ipsum quasi ad ullam.',
      piority : false
    },
    {
      id : 4,
      title : "Rijeka begins year of European Capital of",
      idTopic : 1,
      url : '/assets/img/event-img/event1.png',
      time : new Date('2023-4-30'), // 7
      author : 'EuroNews',
      counter : '4 min read',
      location : 'Meeting room c201',
      group : 'Program c201',
      content : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo numquam aut dolorum perspiciatis dolor eaque neque ullam, sint culpa temporibus itaque aliquam! Quam, minus animi aperiam reiciendis est nobis inventore!\
Delectus, placeat iure itaque hic harum labore quos repellat soluta aperiam cum quis numquam autem sint magni praesentium minus ducimus dolor quia cupiditate atque voluptas. Tempore iste dignissimos laborum debitis?\
Ea in fuga quae officiis consequuntur reprehenderit dolor incidunt impedit cum vel, tempore beatae eaque, fugit quaerat voluptates dolorum necessitatibus ipsa asperiores doloribus recusandae. Nesciunt consequatur ut vitae blanditiis nobis.\
Doloribus deleniti officia dicta velit voluptas est, odit numquam optio pariatur, doloremque, temporibus odio voluptatem voluptatibus ex. Omnis magnam saepe perferendis beatae id quo sed, quas, incidunt modi quia sequi.\
Deserunt modi asperiores a tempora officia reiciendis natus, fugiat voluptatem. Repudiandae saepe cupiditate explicabo? Atque itaque quas aspernatur corporis quaerat in dolorum distinctio harum ea. Repudiandae ipsum quasi ad ullam.Deserunt modi asperiores a tempora officia reiciendis natus, fugiat voluptatem. Repudiandae saepe cupiditate explicabo? Atque itaque quas aspernatur corporis quaerat in dolorum distinctio harum ea. Repudiandae ipsum quasi ad ullam.',
      piority : false
    },
    {
      id : 5,
      title : "Rijeka begins year of European Capital of",
      idTopic : 3,
      url : '/assets/img/event-img/event3.png',
      time : new Date('2023-6-1'), // 8
      author : 'EuroNews',
      counter : '4 min read',
      location : 'Meeting room c201',
      group : 'Program c201',
      content : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo numquam aut dolorum perspiciatis dolor eaque neque ullam, sint culpa temporibus itaque aliquam! Quam, minus animi aperiam reiciendis est nobis inventore!\
Delectus, placeat iure itaque hic harum labore quos repellat soluta aperiam cum quis numquam autem sint magni praesentium minus ducimus dolor quia cupiditate atque voluptas. Tempore iste dignissimos laborum debitis?\
Ea in fuga quae officiis consequuntur reprehenderit dolor incidunt impedit cum vel, tempore beatae eaque, fugit quaerat voluptates dolorum necessitatibus ipsa asperiores doloribus recusandae. Nesciunt consequatur ut vitae blanditiis nobis.\
Doloribus deleniti officia dicta velit voluptas est, odit numquam optio pariatur, doloremque, temporibus odio voluptatem voluptatibus ex. Omnis magnam saepe perferendis beatae id quo sed, quas, incidunt modi quia sequi.\
Deserunt modi asperiores a tempora officia reiciendis natus, fugiat voluptatem. Repudiandae saepe cupiditate explicabo? Atque itaque quas aspernatur corporis quaerat in dolorum distinctio harum ea. Repudiandae ipsum quasi ad ullam.Deserunt modi asperiores a tempora officia reiciendis natus, fugiat voluptatem. Repudiandae saepe cupiditate explicabo? Atque itaque quas aspernatur corporis quaerat in dolorum distinctio harum ea. Repudiandae ipsum quasi ad ullam.',
      piority : false
    },
    {
      id : 6,
      title : "Rijeka begins year of European Capital of",
      idTopic : 3,
      url : '/assets/img/event-img/event3.png',
      time : new Date('2023-4-22'), //9
      author : 'EuroNews',
      counter : '4 min read',
      location : 'Meeting room c201',
      group : 'Program c201',
      content : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo numquam aut dolorum perspiciatis dolor eaque neque ullam, sint culpa temporibus itaque aliquam! Quam, minus animi aperiam reiciendis est nobis inventore!\
Delectus, placeat iure itaque hic harum labore quos repellat soluta aperiam cum quis numquam autem sint magni praesentium minus ducimus dolor quia cupiditate atque voluptas. Tempore iste dignissimos laborum debitis?\
Ea in fuga quae officiis consequuntur reprehenderit dolor incidunt impedit cum vel, tempore beatae eaque, fugit quaerat voluptates dolorum necessitatibus ipsa asperiores doloribus recusandae. Nesciunt consequatur ut vitae blanditiis nobis.\
Doloribus deleniti officia dicta velit voluptas est, odit numquam optio pariatur, doloremque, temporibus odio voluptatem voluptatibus ex. Omnis magnam saepe perferendis beatae id quo sed, quas, incidunt modi quia sequi.\
Deserunt modi asperiores a tempora officia reiciendis natus, fugiat voluptatem. Repudiandae saepe cupiditate explicabo? Atque itaque quas aspernatur corporis quaerat in dolorum distinctio harum ea. Repudiandae ipsum quasi ad ullam.Deserunt modi asperiores a tempora officia reiciendis natus, fugiat voluptatem. Repudiandae saepe cupiditate explicabo? Atque itaque quas aspernatur corporis quaerat in dolorum distinctio harum ea. Repudiandae ipsum quasi ad ullam.',
      piority : false
    },
    {
      id : 7,
      title : "Rijeka begins year of European Capital of",
      idTopic : 2,
      url : '/assets/img/event-img/event2.png',
      time : new Date('2023-7-1'), // 10
      author : 'EuroNews',
      counter : '4 min read',
      location : 'Meeting room c201',
      group : 'Program c201',
      content : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo numquam aut dolorum perspiciatis dolor eaque neque ullam, sint culpa temporibus itaque aliquam! Quam, minus animi aperiam reiciendis est nobis inventore!\
Delectus, placeat iure itaque hic harum labore quos repellat soluta aperiam cum quis numquam autem sint magni praesentium minus ducimus dolor quia cupiditate atque voluptas. Tempore iste dignissimos laborum debitis?\
Ea in fuga quae officiis consequuntur reprehenderit dolor incidunt impedit cum vel, tempore beatae eaque, fugit quaerat voluptates dolorum necessitatibus ipsa asperiores doloribus recusandae. Nesciunt consequatur ut vitae blanditiis nobis.\
Doloribus deleniti officia dicta velit voluptas est, odit numquam optio pariatur, doloremque, temporibus odio voluptatem voluptatibus ex. Omnis magnam saepe perferendis beatae id quo sed, quas, incidunt modi quia sequi.\
Deserunt modi asperiores a tempora officia reiciendis natus, fugiat voluptatem. Repudiandae saepe cupiditate explicabo? Atque itaque quas aspernatur corporis quaerat in dolorum distinctio harum ea. Repudiandae ipsum quasi ad ullam.Deserunt modi asperiores a tempora officia reiciendis natus, fugiat voluptatem. Repudiandae saepe cupiditate explicabo? Atque itaque quas aspernatur corporis quaerat in dolorum distinctio harum ea. Repudiandae ipsum quasi ad ullam.',
      piority : false
    },
    {
      id : 8,
      title : "Rijeka begins year of European Capital of",
      idTopic : 3,
      url : '/assets/img/event-img/event3.png',
      time : new Date('2023-7-9'),//11
      author : 'EuroNews',
      counter : '4 min read',
      location : 'Meeting room c201',
      group : 'Program c201',
      content : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo numquam aut dolorum perspiciatis dolor eaque neque ullam, sint culpa temporibus itaque aliquam! Quam, minus animi aperiam reiciendis est nobis inventore!\
Delectus, placeat iure itaque hic harum labore quos repellat soluta aperiam cum quis numquam autem sint magni praesentium minus ducimus dolor quia cupiditate atque voluptas. Tempore iste dignissimos laborum debitis?\
Ea in fuga quae officiis consequuntur reprehenderit dolor incidunt impedit cum vel, tempore beatae eaque, fugit quaerat voluptates dolorum necessitatibus ipsa asperiores doloribus recusandae. Nesciunt consequatur ut vitae blanditiis nobis.\
Doloribus deleniti officia dicta velit voluptas est, odit numquam optio pariatur, doloremque, temporibus odio voluptatem voluptatibus ex. Omnis magnam saepe perferendis beatae id quo sed, quas, incidunt modi quia sequi.\
Deserunt modi asperiores a tempora officia reiciendis natus, fugiat voluptatem. Repudiandae saepe cupiditate explicabo? Atque itaque quas aspernatur corporis quaerat in dolorum distinctio harum ea. Repudiandae ipsum quasi ad ullam.Deserunt modi asperiores a tempora officia reiciendis natus, fugiat voluptatem. Repudiandae saepe cupiditate explicabo? Atque itaque quas aspernatur corporis quaerat in dolorum distinctio harum ea. Repudiandae ipsum quasi ad ullam.',
      piority : false
    },
    {
      id : 9,
      title : "Rijeka begins year of European Capital of",
      idTopic : 2,
      url : '/assets/img/event-img/event2.png',
      time : new Date('2022-7-19'),//12
      author : 'EuroNews',
      counter : '4 min read',
      location : 'Meeting room c201',
      group : 'Program c201',
      content : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo numquam aut dolorum perspiciatis dolor eaque neque ullam, sint culpa temporibus itaque aliquam! Quam, minus animi aperiam reiciendis est nobis inventore!\
Delectus, placeat iure itaque hic harum labore quos repellat soluta aperiam cum quis numquam autem sint magni praesentium minus ducimus dolor quia cupiditate atque voluptas. Tempore iste dignissimos laborum debitis?\
Ea in fuga quae officiis consequuntur reprehenderit dolor incidunt impedit cum vel, tempore beatae eaque, fugit quaerat voluptates dolorum necessitatibus ipsa asperiores doloribus recusandae. Nesciunt consequatur ut vitae blanditiis nobis.\
Doloribus deleniti officia dicta velit voluptas est, odit numquam optio pariatur, doloremque, temporibus odio voluptatem voluptatibus ex. Omnis magnam saepe perferendis beatae id quo sed, quas, incidunt modi quia sequi.\
Deserunt modi asperiores a tempora officia reiciendis natus, fugiat voluptatem. Repudiandae saepe cupiditate explicabo? Atque itaque quas aspernatur corporis quaerat in dolorum distinctio harum ea. Repudiandae ipsum quasi ad ullam.Deserunt modi asperiores a tempora officia reiciendis natus, fugiat voluptatem. Repudiandae saepe cupiditate explicabo? Atque itaque quas aspernatur corporis quaerat in dolorum distinctio harum ea. Repudiandae ipsum quasi ad ullam.',
      piority : false
    },
    {
      id : 10,
      title : "Rijeka begins year of European Capital of",
      idTopic : 3,
      url : '/assets/img/event-img/event3.png',
      time : new Date('2023-7-19'),//12
      author : 'EuroNews',
      counter : '4 min read',
      location : 'Meeting room c201',
      group : 'Program c201',
      content : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo numquam aut dolorum perspiciatis dolor eaque neque ullam, sint culpa temporibus itaque aliquam! Quam, minus animi aperiam reiciendis est nobis inventore!\
Delectus, placeat iure itaque hic harum labore quos repellat soluta aperiam cum quis numquam autem sint magni praesentium minus ducimus dolor quia cupiditate atque voluptas. Tempore iste dignissimos laborum debitis?\
Ea in fuga quae officiis consequuntur reprehenderit dolor incidunt impedit cum vel, tempore beatae eaque, fugit quaerat voluptates dolorum necessitatibus ipsa asperiores doloribus recusandae. Nesciunt consequatur ut vitae blanditiis nobis.\
Doloribus deleniti officia dicta velit voluptas est, odit numquam optio pariatur, doloremque, temporibus odio voluptatem voluptatibus ex. Omnis magnam saepe perferendis beatae id quo sed, quas, incidunt modi quia sequi.\
Deserunt modi asperiores a tempora officia reiciendis natus, fugiat voluptatem. Repudiandae saepe cupiditate explicabo? Atque itaque quas aspernatur corporis quaerat in dolorum distinctio harum ea. Repudiandae ipsum quasi ad ullam.Deserunt modi asperiores a tempora officia reiciendis natus, fugiat voluptatem. Repudiandae saepe cupiditate explicabo? Atque itaque quas aspernatur corporis quaerat in dolorum distinctio harum ea. Repudiandae ipsum quasi ad ullam.',
      piority : false
    },
  ]



