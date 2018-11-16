import sys
from win10toast import ToastNotifier
for i in range(1, len(sys.argv)):
	print("params", i, sys.argv[i])
toaster = ToastNotifier()
toaster.show_toast(
	sys.argv[1],
	sys.argv[2],
	icon_path='./i.ico',
	duration=5,
	threaded=True
	)