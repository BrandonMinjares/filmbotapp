-- Dummy table --
DROP TABLE IF EXISTS dummy;
CREATE TABLE dummy(created TIMESTAMP WITH TIME ZONE);

-- Your database schema goes here --
DROP TABLE IF EXISTS Person CASCADE;
DROP TABLE IF EXISTS Movies CASCADE;
DROP TABLE IF EXISTS Review CASCADE;
DROP TABLE IF EXISTS Notifications CASCADE;


CREATE TABLE Person(userID UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb, haveSeen text[] DEFAULT '{}', watchList text[] DEFAULT '{}' , recommendList text[] DEFAULT '{}', last_recommendation_time TIMESTAMP WITH TIME ZONE, created_at TIMESTAMP NOT NULL DEFAULT NOW());
-- CREATE TABLE MovieReview(movieReviewID UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb, userID UUID NOT NULL, FOREIGN KEY (userID) REFERENCES Person(userID));

CREATE TABLE Review(movieReviewID UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), movieid INT NOT NULL, data jsonb, userID UUID NOT NULL, FOREIGN KEY (userID) REFERENCES Person(userID), created_at TIMESTAMP NOT NULL DEFAULT NOW());

-- CREATE TABLE Notifications(notificationID UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), userID UUID NOT NULL, content TEXT NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT NOW(), read BOOLEAN NOT NULL DEFAULT false, FOREIGN KEY (userID) REFERENCES Person(userID));
