# Mango
Mango一种与Objective-C语法非常相似的语言，也是一种iOS程序hotfix的执行方案，可以使用Mango方法替换任何Objective-C方法。


# 项目启用
-(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

    NSString *path = [[NSBundle mainBundle] pathForResource:@"demo" ofType:@"ctrip"];
    NSURL *scriptUrl = [NSURL URLWithString:[NSString stringWithFormat:@"file://%@",path]];
    MMANontext *context = [[MMANontext alloc] init];
    [context evalMangoScriptWithURL:scriptUrl];
    return YES;
}


# Example
#### 定义class
class MainViewController:UIViewController {

}

#### 定义方法和实现
####### 定义类方法和实例方法

+(void)load {

}

-(void)viewDidLoad {

    super.viewDidLoad();
    //ORIG 调用原OC类方法
    self.ORIGviewDidLoad();
}

-(void)customMethodParam1:(id)parma1 param2:(id)param2 {

}


####### 方法调用实现

UIView *view = UIView.alloc().init();

view.backgroundColor = UIColor.whiteColor();

view.frame = CGRectMake(50, 100, 150, 200);

self.view.addSubview:(view);


####### 多参数调用实现

self.customMethodParam1:param2:(@"p1",@"p2");


####### 调用OC方法

self.toOCMethod();  // 脚本未定义此方法，toOCMethod为OC实现

+(void)toOCMethod {...} //OC代码

# property
属性声明和用法与OC一致

@property (copy, nonatomic) NSString *testMainStr;

self.testMainStr = @"Mango Main Str";

# 特殊类型
#### struct
Mango支持原生CGRect / CGPoint / CGSize / NSRange 这四个 struct 类型

struct CGRect frame = {origin:{x:100,y:100},size:{width:100,height:100}}; 

struct CGSize size = CGSizeMake(100,100);

struct CGPoint point = CGPointMake(20, 20);

struct NSRange range =  NSMakeRange(1, 10);

range = {location:2,length:20};

#### Selector
SEL gcdsel = @selector(gcdExample); 

#### GCD
self.performSelector:withObject:(gcdsel,nil);

-(void)gcdExample{

    dispatch_queue_t queue = dispatch_queue_create("com.ctripdemo.mango", DISPATCH_QUEUE_CONCURRENT);
    dispatch_async(queue, ^{
        NSLog(@"dispatch_async");
    });
    dispatch_sync(queue, ^{
        NSLog(@"dispatch_sync");
    });
}

# nil和NULL
支持nil和NULL使用

self.pro1 = nil;

self.pro2 = NULL;


# NSArray / NSString / NSDictionary
NSArray/NSDictionary/NSString 按照oc方式使用它们

//字符串

id mangoValue = @"字符串开始" + 123 + @"结束";

//数组

NSArray *arr = @[@"zhao", @"qian", @"sun", @"li"];

for (int i = 0 ; i < arr.count; i ++){

    NSString *arrVal = arr[i];
}

//字典

NSDictionary *dic = @{@"zhang":@"san",@"li":@"si",@"wang":@"wu",@"zhao":@"liu"};

NSMutableDictionary *mutableDic = NSMutableDictionary.dictionaryWithDictionary:(dic);

dic[@"newKey"] = @"newVal";

# block
#### 统一定义为Block类型使用

Block catStringBlock = ^NSString *(NSString *str1, NSString *str2){

    NSString *result = str1.stringByAppendingString:(str2);
    return result;
};

NSString *result = catStringBlock(@"str1",@"str2");

#### 传递block
self.executeBlock:(catStringBlock);

-(void)executeBlock:(Block)block {

    NSString *value = block(@"val",@"val2");
}

#### 传递block给OC
self.fromMangoBlock:(catStringBlock);

//oc代码

-(void)fromMangoBlock:(NSString * (^)(NSString * str1,NSString * str2))block {

    if(block){ 
        NSString *str = block(@"block",@"lgq str");
        NSLog(@"fromMangoBlock str = %@",str);
    }
}

#### 实现OC block
//oc代码

id ocBlock =  ^NSString *(NSString *str1){

    return [str1 stringByAppendingString:@" mango"];
};

NSString *value = [self fromObjectC:@"https://xxx" block:ocBlock];

NSLog(@"fromObjectCBlock block result = %@",value);

//脚本代码
-(NSString *)fromObjectC:(NSString *)url block:(id)block {

    NSString *value = block(url + @" from ObjectC");
    return value;
}


# 注意事项 

*无法使用class()函数获取class类型，导致编译错误

*不支持__weak、__strong、__block修饰

脚本定义的类不能被继承

脚本类将覆盖OC原生类及其方法，方法同名时脚本使用(ORIG+方法名）可执行原OC方法

NSLog不能打印带参数日志

无法使用@class声明和protocol定义

不支持OC宏定义和C函数

struct类型限制，CGFrame CGSize CGPoint CGRange等声明需要添加前缀struct，且无法单独修改属性

如下例子合法

struct CGRect frame  = CGRectMake(50, 100, 150, 200);

struct CGRect frame = {origin:{x:100,y:100},size:{width:100,height:100}}

struct CGSize size = CGSizeMake(100,100);

struct CGPoint point = {x:50,y:60};

struct NSRange range = {location:2,length:20};

//CGXXXZero常量都不可用 crash

struct CGRect frame = CGRectZero //crash，无常量CGRectZero

//更改属性无效

frame.size = CGSizeMake(120,120);//无效

//无法实现与字符串转换

NSStringFromRange(range) //crash

CGRectFromString(@"{{100, 100}, {100, 100}}")//编译错误


用法参考：https://github.com/YPLiang19/Mango
