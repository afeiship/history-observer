# sync-package
> Sync package to latest.

## usage
```shell
thor sync_package:sync /Users/feizheng/github/next-absolute-package

# or 
cd /Users/feizheng/github/next-absolute-package
thor sync_package:sync .
```

## example
```rb
#!/usr/bin/env ruby
require "fileutils"

dir = "/Users/feizheng/github"

# today's task
Dir["#{dir}/next-*"].each do |item|
  puts "udpate project: #{item}"
  FileUtils.cd(item, :verbose => true) do
    system "rm -rf node_modules"
    system "thor sync_package:sync ."
    system "npm publish --access=public"
  end
end
```


## resources
- https://www.npmjs.com/package/npm-check-updates
- http://whatisthor.com/
- https://github.com/afeiship/thor-notes
