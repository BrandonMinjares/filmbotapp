
import psycopg2
import pandas as pd
import math
import schedule
import time as tm
import csv



def startRecommending(id):
    data = pd.read_csv('ratings.csv')
    userFindAvgById = {}

    # map user id's to rows -- helps with avg rating
    userIDS = {}
    # for average rating, only include ratings, and not missing values, N would be number of ratings, and not total number of ratings
    for x in range(0, len(data.index)):
        userIDS[data.iloc[x][0]] = x
    print(userIDS)

    # Get movie items bot users have in common
    def common_items(user1_data, user2_data):
        result = []
        for x in range(1, len(data.columns)):
            if math.isnan(data.iloc[userIDS[user1_data]][x]) or math.isnan(data.iloc[userIDS[user2_data]][x]):
                continue
            else:
                result.append(x)

        return result


    def user_average_rating(userID, commonItem):
            avg_rating = 0.0
            for x in commonItem:
                avg_rating += data.iloc[userIDS[userID]][x]
                # print('rating')
                # print(avg_rating)

            if len(commonItem) == 0:
                avg = 0
            else:
                avg = avg_rating/len(commonItem)
            userFindAvgById[userID] = avg
            return avg

    def standard_deviation(user1_data, commonItem):
        summation1 = 0,
        avg_rating1 = user_average_rating(user1_data, commonItem)
        for x in commonItem:
            summation1 += pow((data.iloc[userIDS[user1_data]][x] - avg_rating1), 2)
        
        # print('summation')
        return (math.sqrt(summation1[0]))


    def pearson_correlation(user1_data, user2_data):
        if user1_data == user2_data:
            return -1
        commonItem = common_items(user1_data, user2_data)
        print(commonItem)
        numerator1, numerator2 = 0, 0
        summation = 0
        avg1 = user_average_rating(user1_data, commonItem)
        avg2 = user_average_rating(user2_data, commonItem)
        # print(userFindAvgById)
        # print(avg1)
        # print(avg2)
        for x in commonItem:
            numerator1 = data.iloc[userIDS[user1_data]][x] - avg1
            numerator2 = data.iloc[userIDS[user2_data]][x] - avg2
            summation += (numerator1 * numerator2)

        denominator1 = standard_deviation(user1_data, commonItem)
        denominator2 = standard_deviation(user2_data, commonItem)
        if (denominator1 == 0 or denominator2 == 0 or summation == 0):
            return 0
        return summation /(denominator1 * denominator2)

    correlationsArr = []

    for x in range(0, len(data.index)):
        user2 = data.iloc[x][0]
        correlationsArr.append(pearson_correlation(id, user2))

    # Get indices of top 5 values -- will represent indices of user ids in csv file
    topCorrelatedUsers = sorted(range(len(correlationsArr)), key=lambda i: correlationsArr[i])[-5:]

    predictedScores = []
    for x in range(1, len(data.columns)):

        numerator, denominator = 0, 0
        for user in topCorrelatedUsers:
            if math.isnan(data.iloc[user][x]):
                numerator += 0
                denominator += 0
            else:
                numerator += (data.iloc[user][x] - userFindAvgById[data.iloc[user][0]]) * correlationsArr[user]
                denominator += correlationsArr[user]

        if numerator == 0 or denominator == 0:
            predictedScores.append(0)
        else:
            score = round(numerator/denominator, 3)
            predictedScores.append(userFindAvgById[id] + score)

    topMovies = sorted(range(len(predictedScores)), key=lambda i: predictedScores[i])[-10:]
    # print('top movies')
    # print(topMovies)


    recommendations = []

    print(topMovies)
    for num in topMovies:
        recommendations.append(data.columns[num + 1])

    print(recommendations)


    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        database="dev",
        user="postgres",
        password="postgres"
    )
    cur = conn.cursor()
    sql = "UPDATE Person SET recommendList = %s WHERE userid = %s"
    cur.execute(sql, (recommendations, id))
    # close the cursor and connection objects
    conn.commit()


def job():
    # establish a connection to the PostgreSQL database
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        database="dev",
        user="postgres",
        password="postgres"
    )
    cur = conn.cursor()

    # review id must be distinct -- in case user rates same movie multiple times -- need to check if recommendation has been given
    # and date = null or date < (today's date - 6 days) --> null means recommendations havent been given yet
    query = 'SELECT p.userid FROM Person p JOIN Review r ON p.userid = r.userid GROUP BY p.userid HAVING COUNT(r.movieReviewID) >= 2 '
    'AND WHERE last_recommendation_time = NULL OR last_recommendation_time <= DATE_SUB(NOW(), INTERVAL 7 DAY);'

    cur.execute(query, conn)

    usersToRecommend = [item[0] for item in cur.fetchall()]



    cur.execute("select userid, movieid, data->>'rating' as rating from REVIEW order BY movieid ASC", conn)

    results = cur.fetchall()

    # Create a set of all movie IDs
    movie_ids = set(r[1] for r in results)

    # Open the CSV file in write mode
    with open('ratings.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)

        # Write the header row
        writer.writerow([''] + list(movie_ids))

        # Write each user's ratings
        for user_id in set(r[0] for r in results):
            row = [user_id]
            for movie_id in movie_ids:
                rating = next((r[2] for r in results if r[0] == user_id and r[1] == movie_id), '')
                row.append(rating)
            writer.writerow(row)


    for user in usersToRecommend:
        startRecommending(user)



schedule.every(15).seconds.do(job)

while True:
    schedule.run_pending()
    tm.sleep(1)