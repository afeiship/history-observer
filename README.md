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
require "json"

dir = "/Users/feizheng/github"
files = Dir["#{dir}/next-*"]

# today's task
files.each_with_index do |item, index|
  # puts "udpate project: #{item}"
  pkg = JSON.parse(File.read("#{item}/package.json"))

  next if pkg["dependencies"].nil?
  next if pkg["dependencies"]["@feizheng/next-js-core2"].include?("2.4.")

  FileUtils.cd(item, :verbose => true) do
    puts "#{index}/#{files.size}"

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
