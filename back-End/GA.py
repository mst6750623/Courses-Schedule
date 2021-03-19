"""
  Function:自动排课
  Edited by Minghao Xu
  version 3.0
"""
import json

import numpy as np
import random
import matplotlib.pyplot as plt
from pylab import mpl

mpl.rcParams['font.sans-serif'] = ['SimHei']  # 指定默认字体
mpl.rcParams['axes.unicode_minus'] = False  # 解决保存图像是负号'-'显示为方块的问题
import xml.etree.ElementTree as ET
from collections import Counter
from xml.dom import minidom
import traceback

from flask import Flask, request, jsonify, abort, redirect, url_for
from flask_cors import *
from flask import send_from_directory

app = Flask(__name__)

#CORS(app, supports_credentials=True)

CORS(app, resources=r'/*')
#@app.route('/', methods=['GET', 'POST'])
def home():
    fname = "C:\\Users\\harviMa\\Desktop\\back-End\\data\\mathnew.txt.sol317.xml"
    with open(fname, 'r', encoding='utf-8') as fin:
        s = fin.readline()
        print(s)
    return 200


# 判断课程安排是否服从硬约束
def constraint(courses_arrangement, curricula):
    success = 1
    for curriculum in curricula:
        timetable = np.zeros(30)
        for course in curriculum:
            timetable += courses_arrangement[course]
        if any(timetable > 1):
            success = 0
    if success == 0:
        return False
    else:
        return True


# 离散程度函数
def F_discrete(pop, POP_SIZE):
    f_discrete = np.zeros(POP_SIZE)
    for k in range(0, POP_SIZE):
        value = 0
        for course in pop[k].keys():
            if sum(pop[k][course]) > 1:
                d = 0
                position = np.zeros(int(sum(pop[k][course])))
                num = 0
                for i in range(30):
                    if pop[k][course][i] == 1:
                        num += 1
                        position[num - 1] = i
                for i in range(num - 1):
                    d += ((position[i + 1] - position[i]) - 42 / sum(pop[k][course])) ** 2
                d += ((42 + position[0] - position[-1]) - 42 / sum(pop[k][course])) ** 2
                value += d / sum(pop[k][course])
        f_discrete[k] = value
    return f_discrete


# 疲劳度函数
def F_tired(pop, POP_SIZE):
    f_tired = np.zeros(POP_SIZE)
    n = np.zeros(5)
    for k in range(0, POP_SIZE):
        timetable = np.zeros(30)
        for course in pop[k].keys():
            timetable += pop[k][course]
        n[0] = np.sum(timetable[0:6])
        n[1] = np.sum(timetable[6:12])
        n[2] = np.sum(timetable[12:18])
        n[3] = np.sum(timetable[18:24])
        n[4] = np.sum(timetable[24:30])
        f_tired[k] += np.var(n)
    return f_tired


# Teachers' unavailability
def F_unavailability(pop, POP_SIZE, constraint_courses, constraint_periods):
    f_unavailability = np.zeros(POP_SIZE)
    for k in range(POP_SIZE):
        for course in pop[k].keys():
            idx_list = [i for i, x in enumerate(constraint_courses) if x == course]
            for index in idx_list:
                if pop[k][course][constraint_periods[index]] == 1:
                    f_unavailability[k] += 5
    return f_unavailability


# 锦标赛选择法
def selection(pop, POP_SIZE, f_fitness):
    new_pop = []
    n = round(POP_SIZE * 0.3)
    temperary = np.zeros(n)
    for k in range(0, POP_SIZE):
        for j in range(0, n):
            while True:
                temperary[j] = random.randint(0, POP_SIZE - 1)
                success = 1
                if j != 0:
                    for jj in range(0, j):
                        if temperary[jj] == temperary[j]:
                            success = 0
                            break
                if success == 1:
                    break
        position = temperary[0]
        fitness_min = f_fitness[int(temperary[0])]
        for i in range(1, n):
            if f_fitness[int(temperary[i])] < fitness_min:
                fitness_min = f_fitness[int(temperary[i])]
                position = temperary[i]
        new_pop.append(pop[int(position)].copy())
    return new_pop


# 交叉，pc是交叉概率
def crossover(pop, POP_SIZE, pc, Course_num, curricula):
    new_pop = pop.copy()
    for k in range(0, POP_SIZE - 1, 2):
        if random.random() < pc:
            success = 0
            iteration_n = 0
            while success == 0 and iteration_n <= 100:
                iteration_n += 1
                c_point = random.randint(0, Course_num - 1)
                success = 1
                course_arrangement_1 = pop[k]
                course_arrangement_2 = pop[k + 1]
                course_arrangement_1[list(pop[k].keys())[c_point]] = pop[k + 1][list(pop[k].keys())[c_point]]
                course_arrangement_2[list(pop[k].keys())[c_point]] = pop[k][list(pop[k].keys())[c_point]]
                if constraint(course_arrangement_1, curricula) and constraint(course_arrangement_2, curricula):
                    new_pop[k] = course_arrangement_1.copy()
                    new_pop[k + 1] = course_arrangement_2.copy()
                else:
                    success = 0
    return new_pop


# 变异，pm为变异概率
def mutation(pop, POP_SIZE, pm, Course_num, curricula):
    new_pop = pop.copy()
    for k in range(0, POP_SIZE):
        if random.random() < pm:
            success = 0
            iteration_n = 0
            m_point = random.randint(0, Course_num - 1)
            while success == 0 and iteration_n <= 100:
                iteration_n += 1
                new_arrangement = np.zeros(30)
                success = 1
                for l in range(int(sum(pop[k][list(pop[k].keys())[m_point]]))):
                    random_num = random.randint(0, 29)
                    new_arrangement[random_num] += 1
                if any(new_arrangement > 1):
                    success = 0
                    continue
                course_arrangement = pop[k]
                course_arrangement[list(pop[k].keys())[m_point]] = new_arrangement
                if not constraint(course_arrangement, curricula):
                    success = 0
            new_pop[k] = course_arrangement.copy()
            # print("change")
    return new_pop


def best(pop, POP_SIZE, f_fitness):
    best_fitness = 10000000
    for k in range(0, POP_SIZE):
        if f_fitness[k] < best_fitness:
            best_fitness = f_fitness[k]
            best_individual_num = k
    best_individual = pop[best_individual_num]
    return [best_individual, best_fitness]


@app.route("/auto/api", methods=["GET"])
def main():
    json_dict = {}
    pathFile = open("C:\\Users\\harviMa\\Desktop\\back-End\\filepath.txt", 'r', encoding='utf-8')
    for line in pathFile:
        txtPath = line.split(' ')[0]
        xmlPath = line.split(' ')[1]
        print(txtPath," ",xmlPath)
        #root = ET.parse('C:\\Users\\harviMa\\Desktop\\back-End\\data\\mathnew.txt.sol317.xml').getroot()
        xmlPath = 'C:\\Users\\harviMa\\Desktop\\back-End\\data\\'+xmlPath
        txtPath = 'C:\\Users\\harviMa\\Desktop\\back-End\\data\\'+txtPath
        root = ET.parse(xmlPath).getroot()

        courses = []
        days = []
        periods = []
        rooms = []
        for type_tag in root.findall('session'):
            course = type_tag.get('course')
            day = type_tag.get('day')
            period = type_tag.get('period')
            room = type_tag.get('room')
            courses.append(course)
            days.append(day)
            periods.append(period)
            rooms.append(room)

        #fname = "C:\\Users\\harviMa\\Desktop\\back-End\\data\\数学科学学院2018级数学与应用数学(创新实验区)专业编号：12202.txt"
        fname = txtPath
        num_of_lectures = []
        num_of_students = []
        credit = []
        room_capcity = []
        room_available = []
        curricula = []
        constraint_courses = []
        constraint_periods = []
        with open(fname, 'r', encoding='utf-8') as fin:
            s = fin.readline()
            Major_name = s[6:]
            s = fin.readline()
            Courses = s.split()
            Course_num = int(Courses[1])
            s = fin.readline()
            Rooms = s.split()
            Room_num = int(Rooms[1])
            s = fin.readline()
            Days = s.split()
            daymax = int(Days[1])
            s = fin.readline()
            Periods = s.split()
            periodmax = int(Periods[1])
            s = fin.readline()
            Curriculum = s.split()
            Curricula_num = int(Curriculum[1])
            s = fin.readline()
            Constraints = s.split()
            Constraint_num = int(Constraints[1])
            lecture_teacher = {}
            for i in range(3):
                fin.readline()
            for i in range(Course_num):
                s = fin.readline()
                tmp = s.split()
                lecture_teacher[tmp[0]] = tmp[1][2:7]
                num_of_lectures.append(int(tmp[2]))
                num_of_students.append(int(tmp[4]))
                credit.append(float(tmp[5]))
            for i in range(3):
                fin.readline()
            for i in range(Room_num):
                s = fin.readline()
                tmp = s.split()
                room_available.append(tmp[0])
                room_capcity.append(int(tmp[1]))
            for i in range(3):
                fin.readline()
            for i in range(Curricula_num):
                s = fin.readline()
                tmp = s.split(' ', 2)
                tmplist = tmp[2][2:-4].split("', '")
                curricula.append(tmplist)
            for i in range(3):
                fin.readline()
            for i in range(Constraint_num):
                s = fin.readline()
                tmp = s.split()
                constraint_courses.append(tmp[0])
                constraint_periods.append(int(int(tmp[1]) * 6 + int(tmp[2])))
            # print(num_of_lectures)

        # simple range check
        for day in days:
            if int(day) < 0 or int(day) >= daymax:
                print('day range error!')

        for period in periods:
            if int(period) < 0 or int(period) >= daymax * periodmax:
                print('period range error!')

        for room in rooms:
            if room not in room_available:
                print('room not available!')

        # allocate the right amount of events for each course
        courses_unique = []
        for course in courses:
            if course in courses_unique:
                pass
            else:
                courses_unique.append(course)

        counter = Counter(courses)
        for idx, course in enumerate(courses_unique):
            if (counter[course] != num_of_lectures[idx]):
                print('amount of events for each course wrong!')

        # number of students on a single course cannot exceed its room's capcity
        for i, course in enumerate(courses):
            ind = courses_unique.index(course)
            curr_room_capcity = room_capcity[room_available.index(rooms[i])]
            if num_of_students[ind] > curr_room_capcity:
                print('number of students on a single course exceed its room''s capcity!')

        # no two lectures can take place in the same room in the same period
        for i in range(len(courses)):
            for j in range(len(courses)):
                if i != j:
                    if (periods[i] == periods[j]) & (rooms[i] == rooms[j]):
                        print('two lectures can take place in the same room in the same period!')

        # lectures in one curriculum must be scheduled at different times
        for curriculum in curricula:
            for course_A in curriculum:
                index_A = [i for i, x in enumerate(courses) if x == course_A]
                for course_B in curriculum:
                    if course_A != course_B:
                        index_B = [i for i, x in enumerate(courses) if x == course_B]
                        for ind_A in index_A:
                            for ind_B in index_B:
                                if periods[ind_A] == periods[ind_B]:
                                    print('lectures in one curriculum scheduled at the same times!')

        # 初始化种群
        POP_SIZE = 100  # 种群大小
        CHROMO_SIZE = 30  # 染色体长度

        # Class_Size = len(class_course_number) #班级数
        # pop = np.zeros((POP_SIZE, Course_num))
        pop = []
        courses_arrangement = {}
        for index, course in enumerate(courses):
            if course not in courses_arrangement.keys():
                courses_arrangement[course] = np.zeros(30)
            courses_arrangement[course][int(periods[index])] += 1

        random.seed(666)  # 设置随机数种子

        i = 0
        while i < POP_SIZE:
            pop.append(courses_arrangement.copy())
            i += 1

        f_discrete = F_discrete(pop, POP_SIZE)  # 离散程度
        f_tired = F_tired(pop, POP_SIZE)  # 疲劳度
        f_unavailability = F_unavailability(pop, POP_SIZE, constraint_courses, constraint_periods)
        [k1, k2, k3] = [0.01, 5, 1]  # 适应度函数中的各函数权重
        f_fitness = k1 * f_discrete + k2 * f_tired + k3 * f_unavailability  # 适应度函数

        # 繁殖
        iteration = 100  # 迭代次数
        best_individual = list(np.zeros(iteration))
        fitness_value = np.zeros(iteration)
        for n in range(0, iteration):
            # print(n)
            pop = selection(pop, POP_SIZE, f_fitness)  # 运用锦标赛算法选择新的个体
            pop = crossover(pop, POP_SIZE, 0.1, Course_num, curricula)  # 交叉
            pop = mutation(pop, POP_SIZE, 0.3, Course_num, curricula)  # 变异
            f_discrete = F_discrete(pop, POP_SIZE)
            #print('f_discrete =', min(f_discrete))
            f_tired = F_tired(pop, POP_SIZE)
            #print('f_tired =', min(f_tired))
            f_unavailability = F_unavailability(pop, POP_SIZE, constraint_courses, constraint_periods)
            f_fitness = k1 * f_discrete + k2 * f_tired + k3 * f_unavailability
            [best_individual[n], fitness_value[n]] = best(pop, POP_SIZE, f_fitness)
            #print(fitness_value[n])
        best_fitness = 10000000
        for i in range(0, iteration):
            if fitness_value[i] < best_fitness:
                best_fitness = fitness_value[i]
                best_individual_number = i

        # 绘制适应度函数折线图
        x_value = list(range(1, iteration + 1))
        y_value = fitness_value
        plt.plot(x_value, y_value)

        period_room = {}
        arrangement_result = []
        for course in best_individual[best_individual_number].keys():
            for period in [i for i, x in enumerate(best_individual[best_individual_number][course]) if x == 1]:
                if str(period) not in period_room.keys():
                    period_room[str(period)] = ['Room1']
                    arrangement_result.append([course, lecture_teacher[course], str(period % 6), str(period // 6), 'Room1'])
                else:
                    period_room[str(period)].append('Room' + str(len(period_room[str(period)]) + 1))
                    arrangement_result.append([course, lecture_teacher[course], str(period % 6), str(period // 6),
                                               'Room' + str(len(period_room[str(period)]))])

        json_dict[Major_name] = arrangement_result
    data = json.dumps(json_dict)
    pathFile.close()
    return data, 200, {"ContentType": "application/json"}


if __name__ == "__main__":
    app.run(
        host='0.0.0.0',
        port=5002,
        debug=False
    )
