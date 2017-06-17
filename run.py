# -*- coding:utf-8 -*-

import os, commands


def main():
    fpBefore = 'before.js'
    fpMain = 'main.js'
    fpTarget = '_run_.js'
    jsList = []
    for root, dirs, files in os.walk('.'):
        for f in files:
            if os.path.splitext(f)[1] != '.js':
                continue
            if f == fpBefore or f == fpMain or f == fpTarget:
                continue
            jsList.append(os.path.join(root, f))
    content = []
    with open(fpBefore, 'r') as f:
        content.append(f.read())
    for jsf in jsList:
        with open(jsf, 'r') as f:
            content.append(f.read())
    with open(fpMain, 'r') as f:
        content.append(f.read())

    if os.path.isfile(fpTarget):
        os.remove(fpTarget)
    with open(fpTarget, 'w') as f:
        f.write('\n'.join(content))
    output = commands.getstatusoutput('node _run_.js')
    os.remove(fpTarget)
    with open('_result_.txt', 'w') as f:
        f.write(output[1])


if __name__ == '__main__':
    main()
