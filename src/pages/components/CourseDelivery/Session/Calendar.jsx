import React from 'react';
import './Calendar.css'; // Create this CSS file
import { useNavigate } from 'react-router-dom';

const Calendar = () => {
    const navigate = useNavigate();
    return (
        <div className="flex- w-screen ml-80 p-4 calendar-container">
            <div className="calendar-sidebar">
                <div className="sidebar-header">
                    <div className="logo">Fireblaze</div>
                </div>
                <button className="schedule-button" onClick={() => navigate('/sessions')}>
                    + Schedule session
                </button>
                {/* <button className="schedule-button">+ Schedule session</button> */}
                <button className="back-home">Back to home</button>
                <div className="month-selector">
                    <div className="month-title">February 2025</div>
                    <div className="month-arrows">
                        <button>&lt;</button>
                        <button>&gt;</button>
                    </div>
                </div>
                <div className="calendar-grid">
                    <div className="day-names">
                        <span>Su</span>
                        <span>Mo</span>
                        <span>Tu</span>
                        <span>We</span>
                        <span>Th</span>
                        <span>Fr</span>
                        <span>Sa</span>
                    </div>
                    <div className="day-numbers">
                        {/* Replace with actual logic to generate days */}
                        <span>26</span><span>27</span><span>28</span><span>29</span><span>30</span><span>31</span><span>01</span>
                        <span>02</span><span>03</span><span>04</span><span className="selected">05</span><span>06</span><span>07</span><span>08</span>
                        <span>09</span><span>10</span><span>11</span><span>12</span><span>13</span><span>14</span><span>15</span>
                        <span>16</span><span>17</span><span>18</span><span>19</span><span>20</span><span>21</span><span>22</span>
                        <span>23</span><span>24</span><span>25</span><span>26</span><span>27</span><span>28</span><span>01</span>
                        <span>02</span><span>03</span><span>04</span><span>05</span><span>06</span><span>07</span><span>08</span>
                    </div>
                </div>
                <div className="select-trainers">Select Trainers</div>
            {/* </aside> */}
            </div>
            <main className="calendar-main">
                <div className="calendar-header">
                    <div className="date-range">Feb 2 - 8, 2025</div>
                    <div className="header-arrows">
                        <button>&lt;</button>
                        <button>&gt;</button>
                    </div>
                    <div className="view-options">
                        <button className="active">Today</button>
                        <button>List</button>
                        <button>Day</button>
                        <button>Week</button>
                        <button>Month</button>
                    </div>
                </div>
                <div className="time-grid">
                    <div className="time-slots">
                        <span>1PM</span>
                        <span>2PM</span>
                        <span>3PM</span>
                        <span>4PM</span>
                        <span>5PM</span>
                        <span>6PM</span>
                        <span>7PM</span>
                        <span>8PM</span>
                        <span>9PM</span>
                        <span>10PM</span>
                        <span>11PM</span>
                    </div>
                    <div className="day-columns">
                        <div className="day-column"><span>Sun 2/2</span></div>
                        <div className="day-column"><span>Mon 2/3</span></div>
                        <div className="day-column"><span>Tue 2/4</span></div>
                        <div className="day-column selected"><span>Wed 2/5</span></div>
                        <div className="day-column"><span>Thu 2/6</span></div>
                        <div className="day-column"><span>Fri 2/7</span></div>
                        <div className="day-column"><span>Sat 2/8</span></div>
                    </div>
                    <div className="event-area">
                        <div className="event-column selected">
                            <div className="event" style={{ top: '120px', height: '60px' }}></div>
                        </div>
                        {/* Add other event columns similarly */}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Calendar;