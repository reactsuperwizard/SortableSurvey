<?php
if( !class_Exists('rsmPsiuConfig') ){
    class rsmPsiuConfig{
        public static $ind_assess_fields = array(
            array(
            'title' => "My primary work focus is currently on...",
            'values' => array(
                'a' => "Moving the latest thing forward, spotting trends",
                'b' => "Implementing the game plan, generating output",
                'c' => "Building consensus, meeting people's needs, teamwork",
                'd' => "Planning, organizing, systematizing"
                ),
            ),

            /*array(
            'title' => "In my day-to-day work, I most enjoy...",
            'values' => array(
                'a' => "Completing my tasks",
                'b' => "Interacting with others",
                'c' => "Spotting new opportunities",
                'd' => "Analyzing problems"
                ),
            ),

            array(
            'title' => "What my colleagues value most about me is...",
            'values' => array(
                'a' => "My ability to connect and influence others",
                'b' => "My high drive and skill",
                'c' => "My vision and creativity",
                'd' => "My rigor and standards"
                )
            ),

            array(
            'title' => "My personal work space is...",
            'values' => array(
                'a' => "Cluttered/Busy",
                'b' => "Practical/Organized",
                'c' => "Unique/Creative",
                'd' => "Warm/Welcoming"
                ),
            ),

            array(
            'title' => "My typical complaint is that people aren't...",
            'values' => array(
                'a' => "Working hard enough",
                'b' => "Following the process",
                'c' => "Being team players",
                'd' => "Getting it"
                ),
            ),

            array(
            'title' => "What characterizes those who are admired (the heroes) in our organization is that they...",
            'values' => array(
                'a' => "Maintain high quality",
                'b' => "Go the extra mile",
                'c' => "Bring good new ideas",
                'd' => "Uplift those around them"
                )
            ),

            array(
            'title' => "I address problems by...",
            'values' => array(
                'a' => "Working harder, getting others to work harder",
                'b' => "Analyzing, implementing improvements",
                'c' => "Thinking big, finding a new approach",
                'd' => "Communicating, bringing people together"
                ),
            ),

            array(
            'title' => "I like to be praised for being...",
            'values' => array(
                'a' => "Productive",
                'b' => "Accurate",
                'c' => "Empathetic",
                'd' => "Creative"
                ),
            ),

            array(
            'title' => "The culture within our organization can be described as one where...",
            'values' => array(
                'a' => "We follow quality procedures",
                'b' => "We cooperate across departments",
                'c' => "We get the work done",
                'd' => "We adapt to new challenges"
                )
            ),

            array(
            'title' => "I make decisions...",
            'values' => array(
                'a' => "Boldly. I decide when I sense the opportunity.",
                'b' => "Quickly. I figure it out as I go.",
                'c' => "Methodically. I decide when I have all the information.",
                'd' => "Astutely. I decide when I know where people stand."
                ),
            ),

            array(
            'title' => "I'm at my best when I engage my ability to...",
            'values' => array(
                'a' => "Conceptualize",
                'b' => "Analyze",
                'c' => "Empathize",
                'd' => "Act"
                ),
            ),

            array(
            'title' => "The most important thing for the daily operation of our organization is that...",
            'values' => array(
                'a' => "We work as a team",
                'b' => "We push the envelope",
                'c' => "We have systems that work",
                'd' => "We meet our customers' needs"
                )
            ),

            array(
            'title' => "My normal communication style is...",
            'values' => array(
                'a' => "Deliberate, methodical, factual",
                'b' => "Charismatic, expressive, excitable",
                'c' => "Appropriate, connecting, affirming",
                'd' => "Energetic, fast, to the point"
                ),
            ),

            array(
            'title' => "In considering a new job, the most important thing to me is...",
            'values' => array(
                'a' => "The ability to create something new",
                'b' => "The stability and structure",
                'c' => "A performance-driven culture",
                'd' => "A good working environment"
                )
            ),

            array(
            'title' => "The type of person that would best complement the people I work with is...",
            'values' => array(
                'a' => "Efficient and systematic",
                'b' => "A good mediator",
                'c' => "Visionary and progressive",
                'd' => "Motivated by results"
                )
            ),

            array(
            'title' => "I am most satisfied in my work when I can...",
            'values' => array(
                'a' => "Think outside the box",
                'b' => "Achieve high quality",
                'c' => "Develop strong relationships",
                'd' => "Score a victory"
                ),
            ),

            array(
            'title' => "If I had some spare time at work, I would like to...",
            'values' => array(
                'a' => "Clean up or organize my environment",
                'b' => "Get through some of the day-to-day work",
                'c' => "Get a new project under way",
                'd' => "Walk around and connect with my colleagues"
                )
            ),

            array(
            'title' => "For a person to meet the needs of my boss, they need a good knowledge of...",
            'values' => array(
                'a' => "Systems and procedures",
                'b' => "Customer/user needs",
                'c' => "Trends and future developments",
                'd' => "How to get people to work as a team"
                )
            ),

            array(
            'title' => "When I'm feeling stressed or overwhelmed, I tend to...",
            'values' => array(
                'a' => "Work harder",
                'b' => "Seek escape",
                'c' => "Seek companionship",
                'd' => "Withdraw inwardly"
                ),
            ),

            array(
            'title' => "I am most satisifed in my work when I can be...",
            'values' => array(
                'a' => "Organized",
                'b' => "In a team",
                'c' => "Productive",
                'd' => "Creative"
                )
            ),

            array(
            'title' => "The most important areas of responsibility in my job are...",
            'values' => array(
                'a' => "Developing people",
                'b' => "Ensuring that work is accomplished",
                'c' => "Developing new products or services",
                'd' => "Controlling the daily operations"
                )
            ),

            array(
            'title' => "I solve problems by working in a...",
            'values' => array(
                'a' => "Quick and linear way",
                'b' => "Fast and intuitive way",
                'c' => "Holistic and intuitive way",
                'd' => "Methodical and linear way"
                )
            ),

            array(
            'title' => "In a perfect world, my job would permit me to...",
            'values' => array(
                'a' => "Be with people I like",
                'b' => "Experience something exciting",
                'c' => "Concentrate on my work",
                'd' => "Get things under control"
                )
            ),

            array(
            'title' => "The most demanding aspects of my job are...",
            'values' => array(
                'a' => "Achieving greater efficiency",
                'b' => "The sheer volume of work",
                'c' => "Adapting to change",
                'd' => "Dealing with people"
                )
            ),

            array(
            'title' => "What I consider most important when making a decision is...",
            'values' => array(
                'a' => "Getting results fast",
                'b' => "Adhering to sound policies",
                'c' => "Getting buy-in",
                'd' => "Staying ahead of the curve"
                )
            ),

            array(
            'title' => "The kind of new job that I would like to pursue is one with...",
            'values' => array(
                'a' => "Changing tasks and challenges",
                'b' => "Efficient and well-organized working conditions",
                'c' => "Cordial and collaborative people",
                'd' => "Autonomy and clearly defined goals"
                )
            ),

            array(
            'title' => "The expectations for my role are that I...",
            'values' => array(
                'a' => "Produce measurable results fast",
                'b' => "Lead and inspire others",
                'c' => "Solve problems creatively",
                'd' => "Work carefully and systematically"
                ),
            ),

            array(
            'title' => "In my job, I am good at...",
            'values' => array(
                'a' => "Finding new ways to accomplish things",
                'b' => "Ensuring things are done correctly",
                'c' => "Focusing on what to do and getting it done",
                'd' => "Harmonizing the work environment"
                )
            ),

            array(
            'title' => "To be successful in my role, the person taking over from me should be able to...",
            'values' => array(
                'a' => "Thrive under pressure",
                'b' => "Resolve conflicts",
                'c' => "Create stability",
                'd' => "Drive innovation"
                ),
            ),

            array(
            'title' => "What I want others to notice about me is...",
            'values' => array(
                'a' => "My work ethic",
                'b' => "My diplomacy",
                'c' => "My thoroughness",
                'd' => "My imagination"
                )
            ),

            array(
            'title' => "What characterizes me in meetings is that I...",
            'values' => array(
                'a' => "Facilitate good communication",
                'b' => "Provide objective knowledge and information",
                'c' => "Keep us on track",
                'd' => "Come up with new ideas"
                )
            ),

            array(
            'title' => "A good day for me is when I can...",
            'values' => array(
                'a' => "Work without interruptions",
                'b' => "Explore what's out there",
                'c' => "Create order out of chaos",
                'd' => "Really connect with others"
                )
            ),

            array(
            'title' => "My colleagues expect me to...",
            'values' => array(
                'a' => "Win",
                'b' => "Create",
                'c' => "Lead",
                'd' => "Control"
                )
            ),

            array(
            'title' => "In general, my most important reason for putting off a decision is that I do not yet have enough...",
            'values' => array(
                'a' => "Facts",
                'b' => "Political clout",
                'c' => "Time or resources",
                'd' => "Perspective"
                )
            ),

            array(
            'title' => "I need to feel that...",
            'values' => array(
                'a' => "I am accepted",
                'b' => "I am in control",
                'c' => "I am being creative",
                'd' => "I am achieving results"
                )
            ),

            array(
            'title' => "Managers in our organization are praised for...",
            'values' => array(
                'a' => "Working hard",
                'b' => "Taking risks",
                'c' => "Creating order",
                'd' => "Developing staff"
                )
            ),*/
        );

        public static $user_info_fields = array(
            'ufname',
            'ulname',
            'utitle',
            'uemail',
            'ucompany',
            'sfname',
            'slname',
            'stitle',
            'semail',
        );
    }
}
