"""
  Function:自动排课
  Edited by Minghao Xu
  version 1.0
"""

import numpy as np
import pandas as pd
import random
import json
import matplotlib.pyplot as plt
from flask import Flask, jsonify
from flask import request
from flask import abort
from flask_cors import *

# 由Flask创建socket服务端
app = Flask(__name__)
CORS(app, resources=r'/*')
# 离散程度函数
def F_discrete(Course_Hour, pop, POP_SIZE, Course_Amount):
    # 创建一个长度为种群数量的空数组
    f_discrete = np.zeros(POP_SIZE)
    for k in range(0, POP_SIZE):
        value = i = 0
        while i < Course_Amount:
            # 若课时大于1
            if Course_Hour[i] > 1:
                d = 0
                # 创建position为课时大小的空数组
                position = np.zeros(Course_Hour[i])
                num = 0
                for j in range(0, 25):
                    if pop[k, i, j] == 1:
                        num += 1
                        position[num - 1] = j
                for j in range(0, num - 1):
                    d += (position[j + 1] - position[j]) ** 2
                d += (35 + position[0] - position[num - 1]) ** 2
                value += d / Course_Hour[i]

            i += 1
        f_discrete[k] = value
    return f_discrete


# 疲劳度函数
def F_tired(Course_Number, pop, POP_SIZE, Course_Amount, class1_course_number, class2_course_number, Class_Size):
    f_tired = np.zeros(POP_SIZE)
    n = np.zeros(5)
    for k in range(0, POP_SIZE):
        for ll in range(0, Class_Size):
            timetable = np.zeros(25)
            if ll == 0:
                class_course_number = class1_course_number
            else:
                class_course_number = class2_course_number
            for lll in range(0, len(class_course_number)):
                for ii in range(0, Course_Amount):
                    if Course_Number[ii] == class_course_number[lll]:
                        timetable += pop[k, ii]
            n[0] = np.sum(timetable[0:5])
            n[1] = np.sum(timetable[5:10])
            n[2] = np.sum(timetable[10:15])
            n[3] = np.sum(timetable[15:20])
            n[4] = np.sum(timetable[20:25])
            f_tired[k] += np.var(n)
    return f_tired


# 锦标赛选择法
def selection(pop, f_fitness, POP_SIZE, Course_Amount, CHROMO_SIZE):
    new_pop = np.zeros(((POP_SIZE, Course_Amount, CHROMO_SIZE)))
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
        new_pop[k, :] = pop[int(position), :]
    return new_pop


# 交叉，pc是交叉概率
def crossover(Course_Number, pop, pc, POP_SIZE, Course_Amount, class1_course_number,class2_course_number, Class_Size):
    new_pop = pop
    for k in range(0, POP_SIZE - 1, 2):
        if random.random() < pc:
            success = iteration_n = 0
            while success == 0 and iteration_n <= 100:
                iteration_n += 1
                c_point = random.randint(0, Course_Amount - 1)
                success = 1
                for ll in range(0, Class_Size):
                    timetable1 = timetable2 = np.zeros(25)
                    if ll == 0:
                        class_course_number = class1_course_number
                    else:
                        class_course_number = class2_course_number
                    for lll in range(0, len(class_course_number)):
                        for ii in range(0, Course_Amount):
                            if Course_Number[ii] == class_course_number[lll] and ii != c_point:
                                timetable1 += pop[k, ii]
                                timetable2 += pop[k + 1, ii]
                                break
                            elif Course_Number[ii] == class_course_number[lll] and ii == c_point:
                                timetable1 += pop[k + 1, ii]
                                timetable2 += pop[k, ii]
                                break
                        success *= (np.prod(np.array(timetable1 <= 1).astype(int)) * np.prod(
                            np.array(timetable2 <= 1).astype(int)))
            new_pop[k, c_point] = pop[k + 1, c_point]
            new_pop[k + 1, c_point] = pop[k, c_point]
    return new_pop


# 变异，pm为变异概率
def mutation(Course_Number, Course_Hour, pop, pm, POP_SIZE, Course_Amount, class1_course_number, class2_course_number, Class_Size):
    new_pop = pop
    for k in range(0, POP_SIZE):
        if random.random() < pm:
            success = iteration_n = 0
            m_point = random.randint(0, Course_Amount - 1)
            while success == 0 and iteration_n <= 100:
                iteration_n += 1
                new_arrangement = np.zeros(25)
                success = 1
                for l in range(0, Course_Hour[m_point]):
                    random_num = random.randint(0, 24)
                    new_arrangement[random_num] += 1
                for ll in range(0, Class_Size):
                    timetable = np.zeros(25)
                    if ll == 0:
                        class_course_number = class1_course_number
                    else:
                        class_course_number = class2_course_number
                    for lll in range(0, len(class_course_number)):
                        for ii in range(0, Course_Amount):
                            if Course_Number[ii] == class_course_number[lll] and ii != m_point:
                                timetable += pop[k, ii]
                                break
                            elif Course_Number[ii] == class_course_number[lll] and ii == m_point:
                                timetable += new_arrangement
                                break
                        success *= np.prod(np.array(timetable <= 1).astype(int))
            new_pop[k, m_point] = new_arrangement
    return new_pop


def best(pop, f_fitness, POP_SIZE):
    best_fitness = 10000000
    for k in range(0, POP_SIZE):
        if f_fitness[k] < best_fitness:
            best_fitness = f_fitness[k]
            best_individual_num = k
    best_individual = pop[best_individual_num, :]
    return [best_individual, best_fitness]


def bestResult(course_data_df, class1_course_number,class2_course_number, best_result, Class_Size):
    data1 = []
    data2 = []
    # 按列遍历best_result,当前列若有不为0的元素，将当前行对应的课程信息（需分别两次判断班级）插入对应班级的json数组中，否则插入0.
    for col in range(0, 25):
        find1 = 0
        find2 = 0  # 标识1班和2班是否当前时间没课
        for row in range(0, len(best_result)):
            if best_result[row, col] != 0:
                number = course_data_df[row, 0]
                for classNum in range(0, Class_Size):
                    if classNum == 0:
                        class_course_number = class1_course_number
                    else:
                        class_course_number = class2_course_number
                    for ll in range(0, len(class_course_number)):
                        if class_course_number[ll] == number:  # 若当前班级有这门课
                            if classNum == 0:  # 是1班
                                data1.append(
                                    {"id": number, "name": course_data_df[row, 3], "score": course_data_df[row, 1]})
                                find1 = 1
                            elif classNum == 1:
                                data2.append(
                                    {"id": number, "name": course_data_df[row, 3], "score": course_data_df[row, 1]})
                                find2 = 1
        if find1 == 0:
            data1.append({"id": "", "name": "", "score": ""})
        if find2 == 0:
            data2.append({"id": "", "name": "", "score": ""})

    return [data1, data2]


@app.route('/manual/api', methods=['POST'])
def main():
    # 如果请求里面没有json数据，或者json数据里面title的内容为空
    #if not request.json:
    #    abort(400)  # 返回404错误

    # result = [(item.get('name', 'NA'), item.get('short', 'NA')) for item in request.json.items]

    course = request.json['items']
    class1 = request.json['class1']
    class2 = request.json['class2']

    course_data_df = np.zeros((len(course), 4), dtype=object)
    class1_course_number = np.zeros(len(class1), dtype=object)
    class2_course_number = np.zeros(len(class2), dtype=object)
    for i in range(0, len(course)):
        course_data_df[i, 0] = course[i]['id']
        course_data_df[i, 1] = course[i]['score']
        course_data_df[i, 2] = course[i]['num']
        course_data_df[i, 3] = course[i]['name']

    for j in range(0, len(class1)):
        class1_course_number[j] = class1[j]
    for k in range(0, len(class2)):
        class2_course_number[k] = class2[k]
    print(course_data_df)
    print(class1_course_number)
    print(class2_course_number)
    # course_data_df=np.zeros(request)

    # def main():
    # 初始化种群
    POP_SIZE = 100  # 种群大小
    CHROMO_SIZE = 25  # 染色体长度

    # 导入课程数据
    # with pd.ExcelFile(r"E:\同济\大学辅修专业排课建模与算法\experiment1.xlsx") as xls:
    # course_data_df = pd.read_excel(xls,"Sheet2")
    # course_data_df = course_data_df.values
    Course_Number = course_data_df[:, 0]  # 课程编号
    Credit = course_data_df[:, 1]  # 课程学分
    Course_Hour = course_data_df[:, 2]  # 课时
    Course_Name = course_data_df[:, 3]  # 课程名称
    Course_Amount = len(Course_Hour)  # 课程数量
    # 导入每个班级的课程编号
    # with pd.ExcelFile(r"E:\同济\大学辅修专业排课建模与算法\experiment1.xlsx") as xls:
    # class1_data_df = pd.read_excel(xls,"class1")
    # with pd.ExcelFile(r"E:\同济\大学辅修专业排课建模与算法\experiment1.xlsx") as xls:
    # class2_data_df = pd.read_excel(xls,"class2")
    # class1_course_number = class1_data_df.values
    # class2_course_number = class2_data_df.values
    Class_Size = 2  # 班级数
    #class_course_number = np.array([ class2_course_number , class1_course_number,])
    pop = np.zeros(((POP_SIZE, Course_Amount, CHROMO_SIZE)))

    for k in range(0, POP_SIZE):
        # 随机生成课程时间
        for i in range(0, Course_Amount):
            success = 0
            while success == 0:
                success = 1
                # 在pop数组的当前行、列第三个元素中创建一个长度为25的空数组
                pop[k, i, :] = np.zeros(25)
                for l in range(0, Course_Hour[i]):
                    # 将n个课时的pop数组第三个元素的位置置为1（但是可能有重复的情况（重复n次取随机数））
                    random_num = random.randint(0, 24)
                    pop[k, i, random_num] += 1
                for ll in range(0, Class_Size):
                    # ll为当前班级（1班或2班）；创建timetable为一个长度为25的空数组
                    timetable = np.zeros(25)

                    # lll为遍历当前班级（由class表得来）的总课程个数（即共有多少种课）的辅助变量
                    if ll == 0:
                        class_course_number = class1_course_number
                    else:
                        class_course_number = class2_course_number

                    for lll in range(0, len(class_course_number)):
                        # ii为遍历总课程个数（由sheet2表得来）（即两个班相加共有多少种课）的辅助变量
                        for ii in range(0, Course_Amount):
                            # 如果遍历sheet2中的课号与当前班级的遍历到的当前课程相等，则timetable等于pop[k,ii]的所有25个元素
                            if Course_Number[ii] == class_course_number[lll]:
                                timetable += pop[k, ii]
                                break
                    success *= np.prod(np.array(timetable <= 1).astype(int))

    f_discrete = F_discrete(Course_Hour, pop, POP_SIZE, Course_Amount)  # 离散程度
    f_tired = F_tired(Course_Number, pop, POP_SIZE, Course_Amount, class1_course_number,class2_course_number , Class_Size)  # 疲劳度
    [k1, k2] = [0.01, 5]  # 适应度函数中的各函数权重
    f_fitness = k1 * f_discrete + k2 * f_tired  # 适应度函数

    # 繁殖
    iteration = 100  # 迭代次数
    # 创建best_individual为一个1000*课程数*25的空数组
    best_individual = np.zeros(((iteration, Course_Amount, 25)))
    fitness_value = np.zeros(iteration)
    for n in range(0, iteration):
        print(n)
        pop = selection(pop, f_fitness, POP_SIZE, Course_Amount, CHROMO_SIZE)  # 运用锦标赛算法选择新的个体
        pop = crossover(Course_Number, pop, 0.2, POP_SIZE, Course_Amount, class1_course_number,class2_course_number, Class_Size)  # 交叉
        pop = mutation(Course_Number, Course_Hour, pop, 0.1, POP_SIZE, Course_Amount, class1_course_number,class2_course_number,
                       Class_Size)  # 变异
        f_discrete = F_discrete(Course_Hour, pop, POP_SIZE, Course_Amount)
        f_tired = F_tired(Course_Number, pop, POP_SIZE, Course_Amount, class1_course_number,class2_course_number ,Class_Size)
        f_fitness = k1 * f_discrete + k2 * f_tired
        [best_individual[n, :], fitness_value[n]] = best(pop, f_fitness, POP_SIZE)
    best_fitness = 10000000
    for i in range(0, iteration):
        if fitness_value[i] < best_fitness:
            best_fitness = fitness_value[i]
            best_individual_number = i

    class1 = []
    class2 = []
    [class1, class2] = bestResult(course_data_df, class1_course_number, class2_course_number, best_individual[best_individual_number],
                                    Class_Size)

    course1_json = json.dumps({"class1": class1, "class2": class2}, ensure_ascii=False)
    print(course1_json)
    # 绘制适应度函数折线图
    x_value = list(range(1, iteration + 1))
    y_value = fitness_value
    plt.plot(x_value, y_value)

    '''
if __name__ == '__main__':
    main()
'''

    return course1_json, 201  # 并且返回这个添加的task内容和状态码

app.run(
    host="0.0.0.0",
    port="5003",
    debug=False
)

