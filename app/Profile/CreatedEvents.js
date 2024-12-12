"use client";

const CreatedEvents = ({ createdEvents, activeView }) => {
  return (
    <div>
      {createdEvents.length > 0 ? (
            activeView === 'upcoming' ? (
              createdEvents
                .filter(event => 
                  new Date(event.dateStart).getTime() >= Date.now()
                ).length > 0 ? (
                  createdEvents
                    .filter(event => 
                      new Date(event.dateStart).getTime() >= Date.now()
                    )
                    .map((event, index) => (
                      <div className="newEventDisplay" key={index}>
                        <img src={`http://localhost:5000/api/event/uploads/${event.eventImage}` || "heronsNight.jpg"} alt={event.title} />
                        <div className="newEventContentDetails">
                          <h1 className='overflow-hidden text-ellipsis whitespace-nowrap'>{event.title}</h1>
                          <p className='overflow-hidden text-ellipsis whitespace-nowrap'>{event.location}</p>
                          <p>
                            {new Date(event.dateStart).toLocaleDateString('en-us', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}{" - "}
                            {new Date(event.dateEnd).toLocaleDateString('en-us', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="newEventDisplay">
                    <img src="/fwvsdv.jpg" alt="" />
                    <div className="newEventContentDetails">
                      <h1>No Events Found</h1>
                      <p>You have not attended any events yet.</p>
                    </div>
                  </div>
                )
            ) : activeView === 'ongoing' ? (
              createdEvents
                .filter(event => 
                  new Date(event.dateStart).getTime() <= Date.now() && 
                  new Date(event.dateEnd).getTime() >= Date.now()
                ).length > 0 ? (
                  createdEvents
                    .filter(event => 
                      new Date(event.dateStart).getTime() <= Date.now() && 
                      new Date(event.dateEnd).getTime() >= Date.now()
                    )
                    .map((event, index) => (
                      <div className="newEventDisplay" key={index}>
                        <img src={`http://localhost:5000/api/event/uploads/${event.eventImage}` || "heronsNight.jpg"} alt={event.title} />
                        <div className="newEventContentDetails">
                          <h1 className='overflow-hidden text-ellipsis whitespace-nowrap'>{event.title}</h1>
                          <p className='overflow-hidden text-ellipsis whitespace-nowrap'>{event.location}</p>
                          <p>
                            {new Date(event.dateStart).toLocaleDateString('en-us', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}{" - "}
                            {new Date(event.dateEnd).toLocaleDateString('en-us', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="newEventDisplay">
                    <img src="/fwvsdv.jpg" alt="" />
                    <div className="newEventContentDetails">
                      <h1>No Ongoing Events Found</h1>
                      <p>There are currently no ongoing events.</p>
                    </div>
                  </div>
                )
            ) : (
              createdEvents
                .filter(event => 
                  new Date(event.dateEnd).getTime() <= Date.now() || 
                  event.status === 'Ended'
                ).length > 0 ? (
                  createdEvents
                    .filter(event => 
                      new Date(event.dateEnd).getTime() <= Date.now() || 
                      event.status === 'Ended'
                    )
                    .map((event, index) => (
                      <div className="newEventDisplay" key={index}>
                        <img src={`http://localhost:5000/api/event/uploads/${event.eventImage}`} alt={event.title} />
                        <div className="newEventContentDetails">
                          <h1 className='overflow-hidden text-ellipsis whitespace-nowrap'>{event.title}</h1>
                          <p className='overflow-hidden text-ellipsis whitespace-nowrap'>{event.location}</p>
                          <p>
                            {new Date(event.dateStart).toLocaleDateString('en-us', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}{" - "}
                            {new Date(event.dateEnd).toLocaleDateString('en-us', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="newEventDisplay">
                    <img src="/fwvsdv.jpg" alt="" />
                    <div className="newEventContentDetails">
                      <h1>No Events Found</h1>
                      <p>You have not attended any events yet.</p>
                    </div>
                  </div>
                )
            )
          ) : (
            <div className="newEventDisplay">
              <img src="/fwvsdv.jpg" alt="" />
              <div className="newEventContentDetails">
                <h1>No Events Found</h1>
                <p>You have not attended any events yet.</p>
              </div>
            </div>
          )}
    </div>
  )
}

export default CreatedEvents
