# -*- coding:utf-8 -*-

import os, commands, re


def main():
    fpBefore = 'before.js'
    fpMain = 'main.js'
    fpTarget = '_run_.js'
    jsList = []
    codeLineInfo = []
    for root, dirs, files in os.walk('.'):
        for f in files:
            if os.path.splitext(f)[1] != '.js':
                continue
            if f == fpBefore or f == fpMain or f == fpTarget:
                continue
            jsList.append(os.path.join(root, f))
    content = []

    def joinCode(codename, lines):
        if codeLineInfo:
            start = codeLineInfo[-1][1] + 1
        else:
            start = 1
        end = start + len(lines) - 1
        content.extend(lines)
        if not lines[-1].endswith('\n'):
            content.append('\n')
        codeLineInfo.append((start, end, codename))

    with open(fpBefore, 'r') as f:
        joinCode(fpBefore, f.readlines())

    for jsf in jsList:
        with open(jsf, 'r') as f:
            joinCode(jsf, f.readlines())

    with open(fpMain, 'r') as f:
        joinCode(fpMain, f.readlines())

    if os.path.isfile(fpTarget):
        os.remove(fpTarget)
    with open(fpTarget, 'w') as f:
        f.writelines(content)
    output = commands.getstatusoutput('node ' + fpTarget)
    os.remove(fpTarget)
    resultTxt = output[1]
    if output[0] != 0:
        pattern = re.compile(r'\((.+\.js):(\d+):\d+\)')
        pattern2 = re.compile(r'at (.+\.js):(\d+):\d+')
        outputLines = output[1].split('\n')

        def codeLineRecover(l):
            if l.find('_run_.js') != -1:
                if l.startswith('    at '):
                    match = pattern.search(l)
                    if match and len(match.regs) == 3:
                        filename = l[match.regs[1][0]:match.regs[1][1]]
                        if filename.endswith('_run_.js'):
                            lineNumber = int(l[match.regs[2][0]:match.regs[2][1]])
                            parts = []
                            parts.append(l[:match.regs[1][0]])
                            for rs in codeLineInfo:
                                if lineNumber >= rs[0] and lineNumber <= rs[1]:
                                    parts.append(rs[2])
                                    parts.append(':')
                                    parts.append(str(lineNumber - rs[0] + 1))
                                    break
                            parts.append(l[match.regs[2][1]:])
                            return ''.join(parts)
                    match = pattern2.search(l)
                    if match and len(match.regs) == 3:
                        filename = l[match.regs[1][0]:match.regs[1][1]]
                        if filename.endswith('_run_.js'):
                            lineNumber = int(l[match.regs[2][0]:match.regs[2][1]])
                            parts = []
                            parts.append(l[:match.regs[1][0]])
                            for rs in codeLineInfo:
                                if lineNumber >= rs[0] and lineNumber <= rs[1]:
                                    parts.append(rs[2])
                                    parts.append(':')
                                    parts.append(str(lineNumber - rs[0] + 1))
                                    break
                            parts.append(l[match.regs[2][1]:])
                            return ''.join(parts)
                else:
                    lineNumber = int(l.split('_run_.js:')[1])
                    for rs in codeLineInfo:
                        if lineNumber >= rs[0] and lineNumber <= rs[1]:
                            return '%s:%d' % (rs[2], lineNumber - rs[0] + 1)
            return l

        outputLines = map(codeLineRecover, outputLines)
        resultTxt = '\n'.join(outputLines)

    with open('_result_.txt', 'w') as f:
        f.write(resultTxt)


if __name__ == '__main__':
    main()
