## 配置

设置全局配置

```shell
git config --global user.name "[名称]"
git config --global user.email "[邮箱]"
```

## 开始使用

创建 Git 仓库

```shell
git init
```

克隆现有 Git 仓库

```shell
git clone [url]
```

## 提交

提交所有已跟踪文件的更改

```shell
git commit -am "[提交信息]"
```

将新更改追加到上一次提交

```shell
git commit --amend --no-edit
```

## 操作失误时

修改上一次提交的信息

```shell
git commit --amend
```

撤销最近一次提交并保留文件更改

```shell
git reset HEAD~1
```

撤销最近 N 次提交并保留文件更改

```shell
git reset HEAD~N
```

撤销最近一次提交并丢弃文件更改

```shell
git reset HEAD~1 --hard
```

将分支重置为远程状态

```shell
git fetch origin
git reset --hard origin/[分支名称]
```

## 其他操作

将本地 master 分支重命名为 main

```shell
git branch -m master main
```
