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

#### 定义方法
实例方法和类方法

-(void)viewDidLoad{

    super.viewDidLoad();
    //ORIG 调用原OC类方法
    self.ORIGviewDidLoad();
}

+(void)load {

}

方法调用实现

UIView *view = UIView.alloc().init();

view.backgroundColor = UIColor.whiteColor();

view.frame = CGRectMake(50, 100, 150, 200);

self.view.addSubview:(view);

#### property
属性声明和用法与OC一致

@property (copy, nonatomic) NSString *testMainStr;

self.testMainStr = @"Mango Main Str";

#### 实例对象


-(void)mangoMethodTest:(id)sender {

    //任意对象
    id mangoValue = @"字符串开始" + 123 + @"结束";
    self.fromMangoFunction:(mangoValue); //字符串类型
    //数组循环
    
    NSArray *arr = @[@"zhao", @"qian", @"sun", @"li"];
    for (int i = 0 ; i < arr.count; i ++){
        id arrVal = arr[i];
    }
    self.fromMangoFunction:(arr);
    
    //字典
    NSMutableDictionary *dic = @{@"zhang":@"san",@"li":@"si",@"wang":@"wu",@"zhao":@"liu"}.mutableCopy();
    dic[@"newKey"] = @"newVal";
    self.fromMangoFunction:(dic);
    
    //Block
    self.toOCBlock()
    
    //Sel  支持编译指令写法
    SEL gcdsel = @selector(gcdExample);
    
    //GCD
    self.performSelector:withObject:(gcdsel,nil);
    
    //struct
    struct CGRect frame = {origin:{x:100,y:100},size:{width:100,height:100}};
    frame.size = CGSizeMake(120,120);//无效
    self.fromMangoRect:(frame);
    
    //基础类型
    self.fromMangodig:(3.1415926);

    //more params
    NSString *strVal = self.fromMangoStr1:str2:append:(@"多参数: str1,",@"str2",YES);
    self.fromMangoFunction:(strVal);

    //    double dVal = MAX(12.141,41123); //不支持宏
    //    fromMangodigL:(dVal)
    //    char *mallocSize = malloc(8); //不支持C函数
    //    printf("qwerqw\n");

}

-(void)toOCBlock {

    Block catStringBlock = ^NSString *(NSString *str1, NSString *str2){
        NSString *result = str1.stringByAppendingString:(str2);
        return result;
    };
    self.fromMangoBlock:(catStringBlock);
    
}

-(NSString *)fromObjectCBlock:(Block)block {

    NSString *value = block(@"from ObjectC");
    self.testMainStr = value;
    return self.testMainStr;
    
}

-(void)gcdExample{

    dispatch_queue_t queue = dispatch_queue_create("com.ctripdemo.mango", DISPATCH_QUEUE_CONCURRENT);
    dispatch_async(queue, ^{
                   NSLog(@"dispatch_async");
                   });
    dispatch_sync(queue, ^{
                  NSLog(@"dispatch_sync");
                  });
}

}

- Object-C

@interface MainViewController ()

@end

@implementation MainViewController

-(void)fromMangoFunction:(id)param {

  NSLog(@"Orignal fromMangoFunction param = %@",param);
  
}

-(void)fromMangoBlock:(NSString * (^)(NSString * str1,NSString * str2))block {

    if(block){
        NSString *str = block(@"block",@"lgq str");
        NSLog(@"fromMangoBlock str = %@",str);
    }
    //
    id ocBlock =  ^NSString *(NSString *str1){
        return str1;
    };
    NSString *value = [self fromObjectCBlock:ocBlock];
    NSLog(@"fromObjectCBlock block result = %@",value);
    
}

-(void)fromMangodig:(double)dig {

  NSLog(@"Orignal fromMangodig dig = %f",dig);
  
}

-(void)fromMangoRect:(CGRect)rect {

    NSLog(@"Orignal fromMangoRect rect = %@",NSStringFromCGRect(rect));
    
}

-(NSString *)fromMangoStr1:(NSString *)str1 str2:(NSString *)str2 append:(BOOL)append {

    return [str1 stringByAppendingString:str2];
    
}

@end


# 注意事项 

*无法使用class()函数获取class类型，导致编译错误

脚本定义的类不能被继承

脚本类将覆盖OC原生类及其方法，方法同名时脚本使用(ORIG+方法名）可执行原OC方法

NSLog不能打印带参数日志

无法使用@class声明和protocol定义

无法使用OC宏定义和C函数

struct类型，CGFrame CGSize CGPoint CGRange等声明需要添加前缀struct，且无法单独修改属性

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
